"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { apiCallForBlob } from "@/lib/api";
import {
  pageNavigationPlugin,
  PageNavigationPlugin,
} from "@react-pdf-viewer/page-navigation";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

interface PdfViewerProps {
  url: string;
}

// Helper component for the page input logic
const PageInput = ({
  currentPage,
  numberOfPages,
  jumpToPage,
}: {
  currentPage: number;
  numberOfPages: number;
  jumpToPage: (pageIndex: number) => void;
}) => {
  const [inputValue, setInputValue] = useState(String(currentPage + 1));

  useEffect(() => {
    setInputValue(String(currentPage + 1));
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(inputValue, 10);
      if (!isNaN(page) && page > 0 && page <= numberOfPages) {
        jumpToPage(page - 1); // jumpToPage is 0-indexed
      } else {
        // Reset to the current page on invalid input
        setInputValue(String(currentPage + 1));
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="w-12 text-center bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span>of {numberOfPages}</span>
    </div>
  );
};

// Main navigation controls component
const PageNavigation = ({
  pageNavigationPluginInstance,
  isFullscreen,
  toggleFullScreen,
}: {
  pageNavigationPluginInstance: PageNavigationPlugin;
  isFullscreen: boolean;
  toggleFullScreen: () => void;
}) => {
  const { GoToNextPage, GoToPreviousPage, CurrentPageLabel, jumpToPage } =
    pageNavigationPluginInstance;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white p-2 rounded-lg shadow-lg z-10">
      <GoToPreviousPage>
        {(props) => (
          <button
            className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
            onClick={props.onClick}
            disabled={props.isDisabled}
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </GoToPreviousPage>
      <div className="px-4">
        <CurrentPageLabel>
          {(props) => (
            <PageInput
              currentPage={props.currentPage}
              numberOfPages={props.numberOfPages}
              jumpToPage={jumpToPage}
            />
          )}
        </CurrentPageLabel>
      </div>
      <GoToNextPage>
        {(props) => (
          <button
            className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
            onClick={props.onClick}
            disabled={props.isDisabled}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </GoToNextPage>
      <div className="ml-4 border-l border-gray-600 pl-4">
        <button
          className="p-2 rounded-md hover:bg-gray-700"
          onClick={toggleFullScreen}
        >
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </div>
  );
};

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

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

  return (
    <Worker workerUrl="/pdf.worker.min.js">
      <div
        ref={viewerRef}
        className={`relative flex flex-col w-full border rounded-lg bg-white ${
          isFullscreen ? "h-screen" : "h-[85vh]"
        }`}
        style={{ userSelect: "none" }}
      >
        {/* PDF Viewer */}
        <div className="flex-grow overflow-auto">
          <style>
            {`
              .rpv-core__page-layer {
                margin-bottom: 40px !important;
                position: relative !important;
                overflow: visible !important;
              }

              .rpv-core__page-layer::after {
                content: '';
                background-image: url('/images/logo_capstonova1.png'); /* Path to your logo */
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain; 

                /* Adjust width/height as needed */
                width: 50vw; 
                height: 50vw;

                position: absolute;
                top: 50%;
                left: 50%;

                /* --- THIS IS THE CHANGE --- */
                /* Removed the 'rotate(-45deg)' */
                transform: translate(-50%, -50%); 

                opacity: 0.1;
                pointer-events: none;
                z-index: 1000;
              }
            `}
          </style>
          <Viewer fileUrl={pdfData} plugins={[pageNavigationPluginInstance]} />
        </div>

        {/* Page Navigation */}
        <PageNavigation
          pageNavigationPluginInstance={pageNavigationPluginInstance}
          isFullscreen={isFullscreen}
          toggleFullScreen={toggleFullScreen}
        />
      </div>
    </Worker>
  );
};

export default PdfViewer;
