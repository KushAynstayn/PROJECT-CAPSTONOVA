"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiCall } from "@/lib/api";
import { EditSuggestionModal } from "./edit-suggestion-modal";
import { ArchiveConfirmationModal } from "./archive-confirmation-modal";
import { Edit, Archive } from "lucide-react";

interface Suggestion {
  suggestion_id: number;
  title: string;
  suggestion_text: string;
  is_archived: boolean;
}

interface ManageSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageSuggestionsModal: React.FC<ManageSuggestionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(
    null
  );
  const [archivingSuggestion, setArchivingSuggestion] =
    useState<Suggestion | null>(null);

  const fetchMySuggestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall("/adviser/suggestions");
      setMySuggestions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load your suggestions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMySuggestions();
    }
  }, [isOpen, fetchMySuggestions]);

  const handleArchiveClick = (suggestion: Suggestion) => {
    setArchivingSuggestion(suggestion);
  };

  const handleConfirmArchive = async () => {
    if (!archivingSuggestion) return;

    try {
      await apiCall(
        `/adviser/suggestions/${archivingSuggestion.suggestion_id}/archive`,
        "PATCH"
      );
      fetchMySuggestions();
    } catch (err: any) {
      setError(err.message || "Failed to archive suggestion.");
    } finally {
      setArchivingSuggestion(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-800">
              Manage Your Suggestions
            </DialogTitle>
            <DialogDescription>
              Here you can edit or archive your submitted ideas.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] border rounded-md p-2 bg-white">
            {isLoading && <p className="text-center p-4">Loading...</p>}
            {error && <p className="text-center p-4 text-red-500">{error}</p>}
            {!isLoading && mySuggestions.length === 0 && (
              <p className="text-center p-4 text-gray-500">
                You have not submitted any suggestions yet.
              </p>
            )}
            <div className="space-y-3">
              {mySuggestions.map((suggestion) => (
                <div
                  key={suggestion.suggestion_id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <p
                      className={`font-semibold text-gray-800 ${
                        suggestion.is_archived
                          ? "text-gray-400 line-through"
                          : ""
                      }`}
                    >
                      {suggestion.title}
                    </p>
                    <p
                      className={`text-sm text-gray-500 truncate ${
                        suggestion.is_archived ? "text-gray-400" : ""
                      }`}
                    >
                      {suggestion.suggestion_text}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSuggestion(suggestion)}
                      disabled={suggestion.is_archived}
                      className="flex items-center gap-1.5"
                    >
                      <Edit className="h-4 w-4" />
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleArchiveClick(suggestion)}
                      disabled={suggestion.is_archived}
                      className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditSuggestionModal
        isOpen={!!editingSuggestion}
        onClose={() => setEditingSuggestion(null)}
        suggestion={editingSuggestion}
        onSuccess={() => {
          setEditingSuggestion(null);
          fetchMySuggestions();
        }}
      />

      <ArchiveConfirmationModal
        isOpen={!!archivingSuggestion}
        onCancel={() => setArchivingSuggestion(null)}
        onConfirm={handleConfirmArchive}
        suggestionTitle={archivingSuggestion?.title || ""}
      />
    </>
  );
};
