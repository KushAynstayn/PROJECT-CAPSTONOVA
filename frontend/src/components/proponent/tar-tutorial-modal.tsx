// src/components/proponent/tar-tutorial-modal.tsx
// [MODIFIED FILE]

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Terminal, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TarTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeBlock = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-2 rounded-md bg-slate-950 p-4">
      <code className="text-sm text-green-400 font-mono break-all block pr-8">
        {command}
      </code>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 hover:bg-slate-800 rounded-md transition-colors"
        title="Copy command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-slate-400" />
        )}
      </button>
    </div>
  );
};

export const TarTutorialModal: React.FC<TarTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"windows" | "mac-linux">(
    "windows"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] w-full flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <DialogHeader className="p-6 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Terminal className="h-5 w-5 text-[#800000]" />
            How to create a clean .tar file
          </DialogTitle>
          <DialogDescription>
            Follow these steps to compress your source code while excluding
            heavy dependency folders.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Critical Warning */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm">
                    Important: Exclude Dependencies
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Please do not upload dependency folders. They are too large
                    and will cause upload failures.
                    <br />
                    Common folders to exclude:
                  </p>
                  <ul className="list-disc list-inside text-sm text-amber-700 mt-1 ml-1 font-mono">
                    <li>node_modules (Node.js)</li>
                    <li>vendor (PHP)</li>
                    <li>venv / .venv (Python)</li>
                    <li>.git (Version Control)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="w-full">
              <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("windows")}
                  className={cn(
                    "text-sm font-medium py-2 rounded-md transition-all",
                    activeTab === "windows"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Windows
                </button>
                <button
                  onClick={() => setActiveTab("mac-linux")}
                  className={cn(
                    "text-sm font-medium py-2 rounded-md transition-all",
                    activeTab === "mac-linux"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  macOS / Linux
                </button>
              </div>

              <div className="mt-6">
                {activeTab === "windows" && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">
                        1. Open PowerShell or Command Prompt
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Navigate inside your project folder:
                      </p>
                      <CodeBlock command="cd C:\path\to\your\project" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">
                        2. Run the compression command
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This creates <code>project.tar</code> in your current
                        folder, automatically excluding common dependency
                        folders.
                      </p>
                      <CodeBlock command='tar -cvf project.tar --exclude "node_modules" --exclude "vendor" --exclude "venv" --exclude ".git" *' />
                    </div>
                  </div>
                )}

                {activeTab === "mac-linux" && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">
                        1. Open Terminal
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Navigate inside your project folder:
                      </p>
                      <CodeBlock command="cd /path/to/your/project" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">
                        2. Run the compression command
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This creates <code>project.tar</code> in your current
                        folder, automatically excluding common dependency
                        folders.
                      </p>
                      <CodeBlock command="tar --exclude='node_modules' --exclude='vendor' --exclude='venv' --exclude='.git' -cvf project.tar ." />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Clarification */}
            <div className="bg-slate-50 p-4 rounded-md text-sm border border-slate-200">
              <h4 className="font-semibold mb-1 text-slate-800">
                Where is my file?
              </h4>
              <p className="text-slate-600">
                The <code>project.tar</code> file will appear in the{" "}
                <strong>same folder</strong> where you ran the command (your
                project folder).
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="p-6 border-t bg-gray-50 flex-shrink-0">
          <Button onClick={onClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
