import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "@/components/ui/register-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-3">
            <Image
              src="/images/capstonova_logo.png"
              alt="Project Capstonova Logo"
              width={40}
              height={40}
            />
            <span className="font-bold text-xl text-brand-red">
              Project Capstonova
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {/* Removed max-w-xs to give the new card design more space */}
          <div className="w-full max-w-md">
            <RegisterForm />
            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-red-600 hover:underline"
              >
                Log in
              </Link>
            </div>
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
