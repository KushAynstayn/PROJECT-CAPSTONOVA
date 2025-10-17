import React from "react";
import Header from "@/components/ui/header";
import ProjectDetailsContent from "@/components/ui/ProjectDetailsContent"; // Import from new client file

interface AbstractPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AbstractPage({
  params,
  searchParams,
}: AbstractPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Await searchParams even if not used to satisfy the type
  await searchParams;

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <main className="pt-16">
        <ProjectDetailsContent id={id} />
      </main>
    </div>
  );
}
