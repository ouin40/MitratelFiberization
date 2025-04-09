"use server";

import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export async function uploadFiles(files: File[]) {
  try {
    const uploadPromises = files.map(async (file) => {
      const fileId = uuidv4();
      const blob = await put(`files/${fileId}-${file.name}`, file, {
        access: "public",
      });

      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: blob.url,
        uploadedAt: new Date().toISOString(),
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error("Failed to upload files");
  }
}
