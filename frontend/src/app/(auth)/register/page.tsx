import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "@/components/ui/register-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/capstonova_logo.png"
                alt="Project Capstonova Logo"
                width={40}
                height={40}
              />
              <span className="font-cinzel bg-gradient-to-b from-red-600 to-orange-300 bg-clip-text text-[17px] font-bold text-transparent">
                PROJECT CAPSTONOVA
              </span>
            </div>
          </div>

          {/* --- ADDED THIS SECTION --- */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Sign up</h2>
            <p className="text-sm text-gray-500">
              Please provide your details to create an account.
            </p>
          </div>

          <RegisterForm />

          <div className="mt-4 text-center text-sm text-gray-600">
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