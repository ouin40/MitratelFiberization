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
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [filesToDownload, setFilesToDownload] = useState<FileWithFlags[]>([]);

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
    setFilesToDelete([id]);
    setShowDeleteConfirm(true);
  };

  const handleDownloadFile = (file: FileWithFlags) => {
    setFilesToDownload([file]);
    setShowDownloadConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete all files in filesToDelete
      for (const id of filesToDelete) {
        await deleteFile(id);
      }

      // Update state
      setFiles(files.filter((file) => !filesToDelete.includes(file.id)));

      // Clear selection if deleted files were selected
      setSelectedFiles(
        selectedFiles.filter((id) => !filesToDelete.includes(id))
      );
    } catch (error) {
      console.error("Error deleting files:", error);
    } finally {
      setShowDeleteConfirm(false);
      setFilesToDelete([]);
    }
  };

  const confirmDownload = () => {
    // Download all files in filesToDownload
    filesToDownload.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    setShowDownloadConfirm(false);
    setFilesToDownload([]);
  };

  const handleSelectFile = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, id]);
    } else {
      setSelectedFiles(selectedFiles.filter((fileId) => fileId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(sortedFiles.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;

    setFilesToDelete([...selectedFiles]);
    setShowDeleteConfirm(true);
  };

  const handleBulkDownload = () => {
    if (selectedFiles.length === 0) return;

    const filesToDownload = files.filter((file) =>
      selectedFiles.includes(file.id)
    );
    setFilesToDownload(filesToDownload);
    setShowDownloadConfirm(true);
  };

  // Calculate if the "select all" checkbox should be in an indeterminate state
  const isIndeterminate =
    selectedFiles.length > 0 && selectedFiles.length < sortedFiles.length;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                Manage your uploaded files. Files starting with &apos;X&apos;
                are flagged as lacking a date, and files starting with
                &apos;-&apos; are flagged as lacking an ID.
              </CardDescription>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-1">
                  {selectedFiles.length} selected
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={handleBulkDownload}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedFiles.length === sortedFiles.length &&
                        sortedFiles.length > 0
                      }
                      indeterminate={isIndeterminate}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all files"
                    />
                  </TableHead>
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
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No files uploaded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedFiles.map((file) => (
                    <TableRow
                      key={file.id}
                      className={
                        selectedFiles.includes(file.id) ? "bg-muted/50" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={(checked) =>
                            handleSelectFile(file.id, checked === true)
                          }
                          aria-label={`Select ${file.name}`}
                        />
                      </TableCell>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {filesToDelete.length === 1
                ? "Are you sure you want to delete this file? This action cannot be undone."
                : `Are you sure you want to delete ${filesToDelete.length} files? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Download Confirmation Dialog */}
      <AlertDialog
        open={showDownloadConfirm}
        onOpenChange={setShowDownloadConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Download</AlertDialogTitle>
            <AlertDialogDescription>
              {filesToDownload.length === 1
                ? "Are you sure you want to download this file?"
                : `Are you sure you want to download ${filesToDownload.length} files?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDownload}
              className="bg-green-600 hover:bg-green-700"
            >
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
