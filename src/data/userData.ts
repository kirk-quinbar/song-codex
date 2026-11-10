import { firebaseDb } from '../firebase/config'
import {
    addDoc,
    collection,
    getDocs,
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

interface UserRecord {
    uid: string
    email: string
    displayName: string,
    photoUrl: string
}

function serializeUser(user: WithFieldValue<User>): WithFieldValue<UserRecord>
function serializeUser(user: PartialWithFieldValue<User>, options: SetOptions): PartialWithFieldValue<UserRecord>
function serializeUser(user: PartialWithFieldValue<User>) {
    const record: PartialWithFieldValue<UserRecord> = {}
    if (user.uid !== undefined) record.uid = user.uid
    if (user.email !== undefined) record.email = user.email
    if (user.displayName !== undefined) record.displayName = user.displayName
    if (user.photoUrl !== undefined) record.photoUrl = user.photoUrl
    return record
}

class User {
    constructor(
        public id: string,
        public uid: string,
        public email: string,
        public displayName: string,
        public photoUrl: string
    ) {
    }

    // toString() {
    //     return this.firstName + ' ' + this.lastName
    // }
}

const userConverter: FirestoreDataConverter<User, UserRecord> = {
    toFirestore: serializeUser,
    fromFirestore: (snapshot: QueryDocumentSnapshot<UserRecord>, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        return new User(snapshot.id, data.uid, data.email, data.displayName, data.photoUrl)
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

async function updateUser(uid: string, displayName: string, email: string, photoUrl: string) {
    const userCollection = collection(firebaseDb, 'user')

    const userQuery = query(userCollection, where('uid', '==', uid), limit(1)).withConverter(userConverter)
    const querySnapshot = await getDocs(userQuery)

    if (querySnapshot.docs.length > 0) {
        const existingUser = querySnapshot.docs[0]
        await updateDoc(existingUser.ref, {
            displayName: displayName,
            email: email,
            photoUrl: photoUrl
        })
    }
}

async function createUser(uid: string, displayName: string, email: string, photoUrl: string) {
    const userCollection = collection(firebaseDb, 'user')

    const existingUser = await getUser(uid)
    if (!existingUser) {
        const newUser: UserRecord = {
            uid: uid,
            displayName: displayName,
            email: email,
            photoUrl: photoUrl
        }
        const userRef = (await addDoc(userCollection, newUser)).withConverter(userConverter)

        return userRef
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
