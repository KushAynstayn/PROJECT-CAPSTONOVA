"use client"

import Link from "next/link" // <-- Added import for Link
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" // <-- Added import for Checkbox

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Checkbox id="remember-me" />
            <Label htmlFor="remember-me" className="font-normal text-gray-600">
              Remember me
            </Label>
          </div>
          <Link href="#" className="font-medium underline underline-offset-4">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-black hover:text-white mt-4">
          Login
        </Button>
      </div>
    </form>
  )
}
