"use client";

import React from "react";
import AdviserSuggestionsDetails from "@/components/admin-suggestions/suggestions-details";

interface Adviser {
  id: number;
  name: string;
  email: string;
  advisees_count: number;
}

interface SuggestionViewProps {
  adviser: Adviser;
  onClose: () => void;
}

const SuggestionView = ({ adviser, onClose }: SuggestionViewProps) => {
  // We can now reuse the detailed view component
  return (
    <AdviserSuggestionsDetails
      adviser={{ id: adviser.id, name: adviser.name }}
      onGoBack={onClose}
    />
  );
};

export default SuggestionView;
