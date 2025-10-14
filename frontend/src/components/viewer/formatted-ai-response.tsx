import React from "react";

interface FormattedAiResponseProps {
  responseText: string;
}

export const FormattedAiResponse: React.FC<FormattedAiResponseProps> = ({
  responseText,
}) => {
  // This function splits the text by asterisks and wraps every second segment in a <strong> tag.
  const formatText = (text: string) => {
    const parts = text.split(/(\*.*?\*)/g); // Split by text surrounded by asterisks
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return <strong key={index}>{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <p className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
      {formatText(responseText)}
    </p>
  );
};
