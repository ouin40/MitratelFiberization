"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Upload, ArrowDownAZ, ArrowUpZA, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type FileWithFlags,
  getAllFiles,
  saveFiles,
  deleteFile,
  processFiles,
} from "@/lib/local-storage";

export default function FilesPage() {
  const [files, setFiles] = useState<FileWithFlags[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [sortField, setSortField] = useState<"name" | "size" | "uploadedAt">(
    "uploadedAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Load files from IndexedDB on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const storedFiles = await getAllFiles();
        setFiles(storedFiles);
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };

    loadFiles();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);

    try {
      // Process files locally using original file dates
      const processedFiles = await processFiles(Array.from(e.target.files));

      // Save to IndexedDB
      await saveFiles(processedFiles);

      // Update state
      setFiles((prev) => [...processedFiles, ...prev]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleSort = (field: "name" | "size" | "uploadedAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "size") {
      comparison = a.size - b.size;
    } else if (sortField === "uploadedAt") {
      comparison =
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format: DD/MM/YYYY HH:MM
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await deleteFile(id);
      setFiles(files.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDownloadFile = (file: FileWithFlags) => {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">File Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload multiple files simultaneously to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="files">Select Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                className="cursor-pointer transition-all duration-200 ease-in-out hover:ring-2 hover:ring-red-400"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-red-700 hover:bg-red-900"
            disabled={isUploading}
            onClick={() => document.getElementById("files")?.click()}
          >
            {isUploading ? "Uploading..." : "Upload Files"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            Manage your uploaded files. Files starting with &apos;X&apos; are
            flagged as lacking a date, and files starting with &apos;-&apos; are
            flagged as lacking an ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      File Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ArrowDownAZ className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowUpZA className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("size")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Size
                      {sortField === "size" &&
                        (sortDirection === "asc" ? (
                          <ArrowDownAZ className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowUpZA className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("uploadedAt")}
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      File Date
                      {sortField === "uploadedAt" &&
                        (sortDirection === "asc" ? (
                          <ArrowDownAZ className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowUpZA className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFiles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No files uploaded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {file.flags.noDate && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="destructive"
                                  className="bg-amber-500"
                                >
                                  No Date
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This file is missing a date</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {file.flags.noId && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive">No ID</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This file is missing an ID</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadFile(file)}
                          >
                            <Download className="h-4 w-4 text-green-500" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
