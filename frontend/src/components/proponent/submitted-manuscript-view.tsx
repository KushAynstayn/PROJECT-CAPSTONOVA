"use client";

import { apiCall } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { authStore } from "@/lib/auth";

const SubmittedManuscriptView: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManuscript = async () => {
      try {
        // First, get the ID of the manuscript
        const metaResponse = await apiCall("/util/my-manuscript-id");
        if (!metaResponse.manuscript_id) {
          setError("No manuscript found for the current user.");
          setIsLoading(false);
          return;
        }

        const manuscriptId = metaResponse.manuscript_id;
        const token = authStore.getToken();

        // Fetch the PDF file as a blob
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/stream/acm/${manuscriptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err: any) {
        setError(err.message || "Failed to fetch manuscript.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchManuscript();

    // Cleanup function to revoke the object URL when the component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

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

  if (!pdfUrl) {
    return <div className="text-center">Could not load PDF file.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Submitted Manuscript</h1>
      <div className="border rounded-lg overflow-hidden h-[80vh]">
        <iframe
          src={pdfUrl}
          title="Submitted Manuscript"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default SubmittedManuscriptView;
