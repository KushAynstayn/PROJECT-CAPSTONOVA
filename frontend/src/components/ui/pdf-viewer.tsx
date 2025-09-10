"use client";

import React, { useEffect, useState } from "react";
import { authStore } from "@/lib/auth";

interface PdfViewerProps {
  url: string;
  title?: string;
}

// Define the API base URL in one place
const API_BASE = "http://127.0.0.1:8000/api";

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title = "Document" }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      setIsLoading(true);
      setError(null);
      const token = authStore.getToken();

      try {
        // --- THIS IS THE FIX ---
        // Prepend the API_BASE to the relative URL passed in props
        const fullUrl = `${API_BASE}${url}`;

        const response = await fetch(fullUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err: any) {
        setError(err.message || "Failed to load PDF.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    // Cleanup function to revoke the object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!pdfUrl) {
    return <div className="text-center">Could not load the document.</div>;
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={pdfUrl}
        title={title}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default PdfViewer;
