"use client";

import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { apiCallForBlob } from "@/lib/api";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const blob = await apiCallForBlob(url);
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        setPdfData(uint8Array);
      } catch (err: any) {
        setError(err.message || "Failed to load PDF.");
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchPdf();
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading document...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!pdfData) {
    return <div className="text-center">Could not load the document.</div>;
  }

  // Point the worker to the new, version-matched file in the /public directory.
  return (
    <Worker workerUrl="/pdf.worker.min.js">
      <div
        style={{
          height: "100%",
          width: "100%",
          userSelect: "none",
        }}
      >
        {/* Custom styles for page spacing and watermarks */}
        <style>
          {`
            .rpv-core__page-layer {
              margin-bottom: 40px !important;
              position: relative !important;
              overflow: visible !important;
            }
            .rpv-core__page-layer::after {
              content: 'CTU';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 8rem;
              color: rgba(0, 0, 0, 0.15);
              font-weight: bold;
              pointer-events: none;
              z-index: 1000;
            }
          `}
        </style>
        <Viewer fileUrl={pdfData} />
      </div>
    </Worker>
  );
};

export default PdfViewer;
