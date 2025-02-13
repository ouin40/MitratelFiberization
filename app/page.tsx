import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Login Dashboard",
  description: "Login to your Mitratel Fiberization account",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-700 gap-y-10 z-10">
      <img
        src="logo-mitratel-only-blur.svg"
        alt="Mitratel M Logo"
        className="w-full max-w-md absolute bottom-0 right-0 z-20"
      />
      <img
        src="logo-name-white.svg"
        alt="Mitratel Logo"
        className="w-full max-w-md z-10"
      />
      <Card className="w-full max-w-md bg-red-50 z-20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Fiberization Dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="dayamitra@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-red-950">
              Password
            </Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full bg-red-700 hover:bg-red-900">
              Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
