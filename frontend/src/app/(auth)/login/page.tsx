import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xs">
          <div className="mb-8 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/capstonova_logo.png"
                alt="Project Capstonova Logo"
                width={40}
                height={40}
              />
              {/* --- MODIFIED LINE: Changed to-orange-500 to to-orange-300 --- */}
              <span className="font-cinzel bg-gradient-to-b from-red-600 to-orange-300 bg-clip-text text-[17px] font-bold text-transparent">
                PROJECT CAPSTONOVA
              </span>
            </div>
          </div>

          <LoginForm />

          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-red-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/login_pic.png"
          alt="CTU Building"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}