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

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload new things",
};

export default function UploadProjectPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Upload Project</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>
            Fill in the details to upload a new project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Project Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-file">Project File</Label>
            <Input id="project-file" type="file" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Upload Project</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
