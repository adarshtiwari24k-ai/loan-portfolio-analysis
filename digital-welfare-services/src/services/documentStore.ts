// Stores the actual uploaded file bytes in IndexedDB, keyed by document id.
// applicationService only ever persists document *metadata* (name/size/type)
// on the application record; the file content lives here instead, since
// IndexedDB comfortably holds file-sized blobs where localStorage would not.
// This keeps the "documents never leave the browser" demo guarantee while
// still letting an officer or citizen actually open what was uploaded.

const DB_NAME = 'dws-documents'
const STORE_NAME = 'blobs'
const DB_VERSION = 1

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveDocumentBlob(id: string, file: Blob): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(file, id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  } catch {
    // IndexedDB unavailable (private browsing, blocked storage, etc).
    // The document stays listed by its metadata; preview just won't work.
  }
}

export async function getDocumentBlob(id: string): Promise<Blob | undefined> {
  try {
    const db = await openDb()
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(id)
      req.onsuccess = () => resolve(req.result as Blob | undefined)
      req.onerror = () => reject(req.error)
    })
    db.close()
    return blob
  } catch {
    return undefined
  }
}

export async function deleteDocumentBlob(id: string): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  } catch {
    // ignore
  }
}
