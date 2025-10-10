"use client";

import dynamic from "next/dynamic";

// Dynamically import the PdfViewer component with server-side rendering disabled
const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
});

export default PdfViewer;
