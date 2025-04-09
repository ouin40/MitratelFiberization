"use client";

import type { Metadata } from "next";
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
import { Textarea } from "@/components/ui/textarea";

// export const metadata: Metadata = {
//   title: "Upload",
//   description: "Upload new things",
// };

export default function UploadProjectPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Upload Files</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Files</CardTitle>
          <CardDescription>
            Click the "Choose file" button to upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-file">KML File</Label>
            <Input
              id="project-file"
              type="file"
              required
              className="cursor-pointer transition-all duration-200 ease-in-out hover:ring-2 hover:ring-red-400"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) console.log("Selected file:", file.name);
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Upload Files</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
