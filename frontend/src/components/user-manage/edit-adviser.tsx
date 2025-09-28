"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
}

interface EditAdviserViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditAdviserView = ({ user, onSave, onCancel }: EditAdviserViewProps) => {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-400 bg-white shadow-xl">
      <img
        src="/images/ctubldg.png"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: "1.3in" }}
      />
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-widest text-gray-700">
            Edit Adviser Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-semibold text-gray-600"
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
          <div>
            <label
              htmlFor="middle_name"
              className="block text-sm font-semibold text-gray-600"
            >
              Middle Name (Optional)
            </label>
            <input
              id="middle_name"
              type="text"
              name="middle_name"
              value={formData.middle_name || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-semibold text-gray-600"
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-x-4">
          <Button
            onClick={handleSave}
            className= "bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
             className= "bg-gray hover:bg-[#630808] text-gray-700 hover:text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAdviserView;
