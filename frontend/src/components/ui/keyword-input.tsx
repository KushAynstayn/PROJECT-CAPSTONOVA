// (MODIFIED)
// Location: frontend/src/components/ui/keyword-input.tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input, InputProps } from "@/components/ui/input";
import { apiCall } from "../../lib/api";

interface KeywordInputProps extends Omit<InputProps, "value" | "onChange"> {
  fetchUrl: string;
  value: string[];
  onValueChange: (values: string[]) => void;
}

const KeywordInput = React.forwardRef<HTMLInputElement, KeywordInputProps>(
  ({ fetchUrl, value, onValueChange, className, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<string[]>([]);

    React.useEffect(() => {
      const fetchSuggestions = async () => {
        try {
          const data = await apiCall(fetchUrl);
          // Filter out suggestions that are already selected
          const filteredData = data.filter(
            (item: string) => !value.includes(item)
          );
          setSuggestions(filteredData);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    }, [fetchUrl, value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
        e.preventDefault();
        const newValues = inputValue
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        const uniqueNewValues = newValues.filter((v) => !value.includes(v));

        if (uniqueNewValues.length > 0) {
          onValueChange([...value, ...uniqueNewValues]);
        }
        setInputValue("");
      }
    };

    const handleRemove = (keywordToRemove: string) => {
      onValueChange(value.filter((keyword) => keyword !== keywordToRemove));
    };

    const handleSuggestionClick = (suggestion: string) => {
      onValueChange([...value, suggestion]);
    };

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 rounded-md border border-input p-2 min-h-10">
          {value.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {keyword}
              <button
                type="button"
                onClick={() => handleRemove(keyword)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <Input
            ref={ref}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 bg-transparent border-none outline-none shadow-none focus-visible:ring-0 p-0 h-auto",
              className
            )}
            {...props}
          />
        </div>
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Suggestions:</span>
            {suggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-secondary"
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }
);

KeywordInput.displayName = "KeywordInput";

export default KeywordInput;
