import { v4 as uuidv4 } from "uuid";

export type FileWithFlags = {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // Base64 encoded file data
  uploadedAt: string;
  flags: {
    noDate: boolean;
    noId: boolean;
  };
};

// IndexedDB setup
const DB_NAME = "file-storage";
const DB_VERSION = 1;
const STORE_NAME = "files";

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject("Error opening database");
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

// Save files to IndexedDB
export const saveFiles = async (files: FileWithFlags[]): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    files.forEach((file) => {
      store.put(file);
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject("Error saving files");
    };
  });
};

// Get all files from IndexedDB
export const getAllFiles = async (): Promise<FileWithFlags[]> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error getting files");
    };
  });
};

// Delete a file from IndexedDB
export const deleteFile = async (id: string): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject("Error deleting file");
    };
  });
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

// Process files for upload
export const processFiles = async (files: File[]): Promise<FileWithFlags[]> => {
  const processedFiles = await Promise.all(
    Array.from(files).map(async (file) => {
      const id = uuidv4();
      const data = await fileToBase64(file);
      const noDate = file.name.startsWith("X");
      const noId = file.name.startsWith("-");

      return {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        data,
        uploadedAt: new Date().toISOString(),
        flags: {
          noDate,
          noId,
        },
      };
    })
  );

  return processedFiles;
};
