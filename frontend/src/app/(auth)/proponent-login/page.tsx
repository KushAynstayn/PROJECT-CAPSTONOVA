
import Image from "next/image"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        
        
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-3">
            <Image
              src="/images/capstonova_logo.png" // Path to your logo
              alt="Project Capstonova Logo"
              width={40} // Adjust size as needed
              height={40}
            />
            <span className="font-bold text-xl text-brand-red">Project Capstonova</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/proponent1.jpg"
          alt="CTU Building"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  )
}