import { firebaseDb } from '../firebase/config'
import {
    addDoc,
    collection,
    getDocs,
    getDoc,
    limit,
    query,
    updateDoc,
    where,
    deleteDoc,
    type FirestoreDataConverter,
    type PartialWithFieldValue,
    type QueryDocumentSnapshot,
    type SetOptions,
    type SnapshotOptions,
    type WithFieldValue,
} from 'firebase/firestore'


//TODO: add createddate and lastmodifieddate to user record and update the createUser and updateUser functions to set these values

interface UserRecord {
    uid: string,
    providerId: string,
    email: string,
    displayName: string,
    photoUrl: string,
    createdDate: Date,
    lastModifiedDate: Date
}

function serializeUser(user: WithFieldValue<User>): WithFieldValue<UserRecord>
function serializeUser(user: PartialWithFieldValue<User>, options: SetOptions): PartialWithFieldValue<UserRecord>
function serializeUser(user: PartialWithFieldValue<User>) {
    const record: PartialWithFieldValue<UserRecord> = {}
    if (user.uid !== undefined) record.uid = user.uid
    if (user.providerId !== undefined) record.providerId = user.providerId
    if (user.email !== undefined) record.email = user.email
    if (user.displayName !== undefined) record.displayName = user.displayName
    if (user.photoUrl !== undefined) record.photoUrl = user.photoUrl
    if (user.createdDate !== undefined) record.createdDate = user.createdDate
    if (user.lastModifiedDate !== undefined) record.lastModifiedDate = user.lastModifiedDate
    return record
}

class User {
    constructor(
        public id: string,
        public uid: string,
        public providerId: string,
        public email: string,
        public displayName: string,
        public photoUrl: string,
        public createdDate: Date,
        public lastModifiedDate: Date
    ) {
    }
}

const userConverter: FirestoreDataConverter<User, UserRecord> = {
    toFirestore: serializeUser,
    fromFirestore: (snapshot: QueryDocumentSnapshot<UserRecord>, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        return new User(snapshot.id, data.uid, data.providerId, data.email, data.displayName, data.photoUrl, data.createdDate, data.lastModifiedDate)
    },
}

async function getUser(uid: string) {
    const userCollection = collection(firebaseDb, 'user')

    const userQuery = query(userCollection, where('uid', '==', uid), limit(1)).withConverter(userConverter)
    const querySnapshot = await getDocs(userQuery)

    if (querySnapshot.docs.length > 0) {
        return querySnapshot.docs[0].data()
    }
    else {
        return null
    }
}

async function updateUser(uid: string, providerId: string, displayName: string, email: string, photoUrl: string) {
    const userCollection = collection(firebaseDb, 'user')

    const userQuery = query(userCollection, where('uid', '==', uid), limit(1)).withConverter(userConverter)
    const querySnapshot = await getDocs(userQuery)

    if (querySnapshot.docs.length > 0) {
        const existingUser = querySnapshot.docs[0]
        await updateDoc(existingUser.ref, {
            providerId: providerId,
            displayName: displayName,
            email: email,
            photoUrl: photoUrl,
            createdDate: existingUser.data().createdDate,
            lastModifiedDate: new Date()
        })
    }
}

async function createUser(uid: string, providerId: string, displayName: string, email: string, photoUrl: string) {
    const userCollection = collection(firebaseDb, 'user').withConverter(userConverter)

    const existingUser = await getUser(uid)
    if (!existingUser) {
        const newUser: UserRecord = {
            uid: uid,
            providerId: providerId,
            displayName: displayName,
            email: email,
            photoUrl: photoUrl,
            createdDate: new Date(),
            lastModifiedDate: new Date()
        }
        const userRef = await addDoc(userCollection, newUser)
        const snap = await getDoc(userRef)
        return snap.data() // User
    }
    else {
        return existingUser
    }
}

async function deleteUser(uid: string) {
  const q = query(
    collection(firebaseDb, 'user'),
    where('uid', '==', uid)
  )

  const snapshot = await getDocs(q)

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref)
  }
}

export {
    getUser,
    updateUser,
    createUser,
    deleteUser
}
