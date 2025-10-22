import React from "react";
import { Button } from "@/components/ui/button";

interface SaveConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const SaveConfirm: React.FC<SaveConfirmProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="rounded-md border border-gray-300 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
          Confirm Save
        </h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to save this new Super Admin?
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onConfirm}
            className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Yes, Save
          </Button>
          <Button
            onClick={onCancel}
            className="bg-gray border-1 border-gray-300 hover:border-[#630808] hover:bg-[#630808] text-gray-700 hover:text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
