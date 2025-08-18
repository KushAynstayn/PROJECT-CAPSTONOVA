"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Combobox from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

const SuperAdminUploadWhitelistPage = () => {
  const initialFormState = {
    firstName: "",
    middleInitial: "",
    lastName: "",
    idNumber: "",
    email: "",
    adviser: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAdviserChange = (value: string) => {
    setFormData({ ...formData, adviser: value });
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
  };

  // --- NEW: HANDLER TO CLEAR A SINGLE INPUT ---
  const handleClear = (fieldName: keyof typeof formData) => {
    setFormData({ ...formData, [fieldName]: "" });
  };

  return (
    <>
      <div className="w-full">
        <h1 className="p-1 text-left text-base font-semibold text-[#a7561f] opacity-50 md:text-lg">
          Enhancing Capstone Archiving and Optimizing Data Intelligence with
          Project CapstoNova
        </h1>
        <div className="h-[2px] w-full bg-gray-200 " />
      </div>

      <main className="flex w-full flex-col items-center py-20">
        <Card className="w-full max-w-3xl rounded-1px border-black shadow-lg shadow-gray-800/50">
          <CardHeader className="p-0 pt-1 pb-0">
            <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
              WHITELIST
            </CardTitle>
          </CardHeader>
          <div className="w-3/5 mx-auto mb-1">
            <Separator className="bg-black" />
          </div>
          <CardContent className="pt-1">
            <form className="space-y-6">
              <h3 className="font-semibold">Project Leader</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {/* First Name */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="firstName" className="font-normal">
                    First Name
                  </Label>
                  <InputWithClear
                    id="firstName"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleChange}
                    onClear={() => handleClear("firstName")}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Middle Initial */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="middleInitial" className="font-normal">
                    Middle Initial (Optional)
                  </Label>
                  <InputWithClear
                    id="middleInitial"
                    placeholder="D."
                    value={formData.middleInitial}
                    onChange={handleChange}
                    onClear={() => handleClear("middleInitial")}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Last Name */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="lastName" className="font-normal">
                    Last Name
                  </Label>
                  <InputWithClear
                    id="lastName"
                    placeholder="dela Cruz"
                    value={formData.lastName}
                    onChange={handleChange}
                    onClear={() => handleClear("lastName")}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* ID Number */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="idNumber" className="font-normal">
                    ID Number
                  </Label>
                  <InputWithClear
                    id="idNumber"
                    placeholder="123456789"
                    value={formData.idNumber}
                    onChange={handleChange}
                    onClear={() => handleClear("idNumber")}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* CTU Email */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email" className="font-normal">
                    CTU Email
                  </Label>
                  <InputWithClear
                    id="email"
                    placeholder="juan.delacruz@ctu.edu.ph"
                    value={formData.email}
                    onChange={handleChange}
                    onClear={() => handleClear("email")}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* MODIFIED: Combobox now receives props from the page's state */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="adviser" className="font-normal">
                    Adviser
                  </Label>
                  <Combobox
                    value={formData.adviser}
                    onValueChange={handleAdviserChange}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="w-full max-w-3xl flex justify-between mt-4 py-7">
          {/* CLEAR ALL BUTTON with active glow */}
          <Button
            onClick={handleClearAll}
            className="bg-gray-200 text-gray-800 font-serif rounded-none shadow-md shadow-gray-500/80
               transition-all hover:scale-105 hover:bg-gray-300 
               active:shadow-lg active:shadow-gray-700/90" // --- ADDED ---
          >
            Clear Information
          </Button>

          {/* UPLOAD WHITELIST BUTTON with active glow */}
          <Button
            className="bg-[#6b211d] text-white font-serif rounded-none shadow-md shadow-gray-500/80
               transition-transform hover:scale-105 hover:bg-[#8c2d29]
               active:shadow-lg active:shadow-gray-700/90" // --- ADDED ---
          >
            Upload whitelist
          </Button>
        </div>
      </main>
    </>
  );
};

export default SuperAdminUploadWhitelistPage;
