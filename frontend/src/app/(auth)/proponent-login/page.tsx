import { LoginForm } from "@/components/ui/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="relative flex items-center justify-center min-h-screen font-sans">
      {/* Background Image */}
      <Image
        alt="Background"
        src="/images/capstonova-bground.jpg"
        fill
        className="-z-10 object-cover"
      />

      {/* Dark Overlay Layer */}
      <div className="absolute inset-0 bg-black/30 -z-10"></div>

      {/* Login Form Container with blur effect */}
      <div className="p-8 border rounded-lg shadow-xl bg-white/30 border-neutral-200/20 backdrop-blur-sm">
        <LoginForm />
      </div>
    </main>
  );
}
