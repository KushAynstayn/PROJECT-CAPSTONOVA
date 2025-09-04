import { LoginForm } from "@/components/ui/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="relative flex items-center justify-center min-h-screen font-sans text-white">
      
      {/* Background Image */}
      <Image
        alt="Background"
        src="/images/landing.jpg"
        fill
        className="-z-10 object-cover"
      />

      {/* Dark Overlay Layer */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div> {/* Added this div */}

      {/* Login Form Container with blur effect */}
     <div className="p-8 border rounded-lg shadow-xl bg-red-900/40 border-red-700/40 backdrop-blur-sm">
      <LoginForm />
     </div>
      
    </main>
  );
}