"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllFiles, type FileWithFlags } from "@/lib/local-storage";

export default function DashboardPage() {
  const [files, setFiles] = useState<FileWithFlags[]>([]);

  useEffect(() => {
    const loadFiles = async () => {
      const data = await getAllFiles();
      setFiles(data);
    };

    loadFiles();
  }, []);

  const totalFiles = files.length;

  const filesWithoutDate = files.filter((file) => file.flags.noDate).length;

  const filesWithoutId = files.filter((file) => file.flags.noId).length;

  const validFiles = files.filter(
    (file) => !file.flags.noDate && !file.flags.noId
  ).length;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Valid Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validFiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Missing Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesWithoutDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Missing ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesWithoutId}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
