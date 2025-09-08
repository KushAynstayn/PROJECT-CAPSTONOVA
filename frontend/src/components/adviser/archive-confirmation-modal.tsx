"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ArchiveConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  suggestionTitle: string;
}

export const ArchiveConfirmationModal: React.FC<
  ArchiveConfirmationModalProps
> = ({ isOpen, onConfirm, onCancel, suggestionTitle }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="mt-4 text-xl font-bold">
            Archive Suggestion
          </DialogTitle>
          <DialogDescription className="mt-2 px-4 text-gray-600">
            Are you sure you want to archive the suggestion titled "
            <strong>{suggestionTitle}</strong>"? This action cannot be undone
            easily.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 bg-[#6b0000] hover:bg-[#5a0000]"
          >
            Confirm Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
