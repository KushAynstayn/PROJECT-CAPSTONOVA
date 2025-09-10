"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiCall } from "@/lib/api";

interface Suggestion {
  suggestion_id: number;
  title: string;
  suggestion_text: string;
}

interface EditSuggestionModalProps {
  suggestion: Suggestion | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditSuggestionModal: React.FC<EditSuggestionModalProps> = ({
  suggestion,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [suggestionText, setSuggestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (suggestion) {
      setSuggestionText(suggestion.suggestion_text);
    }
  }, [suggestion]);

  const handleSave = async () => {
    if (!suggestion) return;

    setIsLoading(true);
    setError(null);
    try {
      await apiCall(`/adviser/suggestions/${suggestion.suggestion_id}`, "PUT", {
        title: suggestion.title,
        suggestion_text: suggestionText,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update suggestion.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!suggestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-800">
            Edit Suggestion
          </DialogTitle>
          <DialogDescription>
            You can only edit the content of your suggestion.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title" className="font-semibold text-gray-600">
              Title (Read-only)
            </Label>
            <Input
              id="title"
              value={suggestion.title}
              readOnly
              disabled
              className="mt-1 bg-gray-100"
            />
          </div>
          <div>
            <Label
              htmlFor="suggestion_text"
              className="font-semibold text-gray-600"
            >
              Suggestion
            </Label>
            <Textarea
              id="suggestion_text"
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              className="mt-1 min-h-[150px]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#6b0000] hover:bg-[#5a0000]"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
