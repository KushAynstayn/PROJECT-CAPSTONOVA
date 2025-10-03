import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xs">
          <div className="mb-8 flex justify-center">
            <div className="flex flex-col items-center"> {/* Removed gap-2 */}
              <Image
                src="/images/logo_capstonova.png"
                alt="Project Capstonova Logo"
                width={150}  
                height={90} 
              />
              {/* Pulled text up and changed gradient to golden yellow */}
              <span className="-mt-10 font-cinzel bg-gradient-to-b from-amber-400 to-yellow-600 bg-clip-text text-[15px] font-bold text-transparent">
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