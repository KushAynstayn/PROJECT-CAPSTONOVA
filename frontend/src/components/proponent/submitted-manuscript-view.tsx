"use client";

import { apiCall } from "@/lib/api";
import React, { useEffect, useState } from "react";
import PdfViewer from "@/components/ui/pdf-viewer-dynamic"; // MODIFIED IMPORT

const SubmittedManuscriptView: React.FC = () => {
  const [manuscriptId, setManuscriptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManuscriptId = async () => {
      try {
        const metaResponse = await apiCall("/util/my-manuscript-id");
        if (!metaResponse.manuscript_id) {
          setError("No manuscript found for the current user.");
        } else {
          setManuscriptId(metaResponse.manuscript_id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch manuscript metadata.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchManuscriptId();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading manuscript...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!manuscriptId) {
    return <div className="text-center">Could not load PDF file.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Submitted Manuscript</h1>
      <div className="border rounded-lg overflow-hidden h-[80vh]">
        {/* Replaced iframe with our new PdfViewer component */}
        <PdfViewer url={`/user/stream/manuscript/${manuscriptId}`} />
      </div>
    </div>
  );
};

export default SubmittedManuscriptView;
