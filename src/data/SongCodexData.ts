import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  Firestore
} from 'firebase/firestore'

export abstract class BaseModel {
  id?: string
}

export interface ModelType<T> {
  new(): T
  collectionName: string
}

export class Idea extends BaseModel {
  static collectionName = 'idea'

  text = ''
  createdDate = new Date()
  lastModifiedDate = new Date()
}

export class User extends BaseModel {
  static collectionName = 'user'

  uid = ''
  providerId = ''
  email = ''
  displayName = ''
  photoUrl = ''
  createdDate = new Date()
  lastModifiedDate = new Date()
}


export class SongCodexData<T extends BaseModel> {

  private readonly collectionName: string

  constructor(
    private db: Firestore,
    private modelType: ModelType<T>
  ) {
    this.collectionName = modelType.collectionName
  }

  async add(entity: T): Promise<string> {

    const data = this.toFirestore(entity)

    const docRef = await addDoc(
      collection(this.db, this.collectionName),
      data
    )

    return docRef.id
  }

  async update(entity: T): Promise<void> {

    if (!entity.id)
      throw new Error('Entity id is required')

    const data = this.toFirestore(entity)

    await updateDoc(
      doc(this.db, this.collectionName, entity.id),
      data
    )
  }

  async delete(id: string): Promise<void> {

    await deleteDoc(
      doc(this.db, this.collectionName, id)
    )
  }

  async get(id: string): Promise<T | null> {

    const snap = await getDoc(
      doc(this.db, this.collectionName, id)
    )

    if (!snap.exists())
      return null

    return this.fromFirestore({
      id: snap.id,
      ...snap.data()
    })
  }

  async search(
    fieldName: string,
    fieldValue: string
  ): Promise<T | null> {

    const q = query(
      collection(this.db, this.collectionName),
      where(fieldName, '==', fieldValue)
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    const docSnap = snapshot.docs[0]

    return this.fromFirestore({
      id: docSnap.id,
      ...docSnap.data()
    })
  }

  async getAll(): Promise<T[]> {

    const snapshot = await getDocs(
      collection(this.db, this.collectionName)
    )

    return snapshot.docs.map(d =>
      this.fromFirestore({
        id: d.id,
        ...d.data()
      })
    )
  }

  private toFirestore(entity: T): Record<string, unknown> {

    const data: Record<string, unknown> = {}

    for (const key of Object.keys(entity)) {

      if (key === 'id')
        continue

      data[key] = (entity as any)[key]
    }

    return data
  }

  private fromFirestore(data: any): T {

    const item = new this.modelType()

    Object.assign(item, data)

    return item
  }
}