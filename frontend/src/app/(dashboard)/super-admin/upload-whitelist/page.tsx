"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "@/components/ui/inputWithClear";
import Combobox from "@/components/ui/combobox";
import WhitelistNavigationBar from "@/components/ui/whitelist-navbar";
import WhitelistView from "../../../../components/whitelist/view-whitelist";
import whitelistData from "@/data/whitelist.json";
import EditWhitelistView from "../../../../components/whitelist/edit-whitelist";
import { FileUpload } from "@/components/ui/file_upload";
import { UploadWhitelistConfirm } from "@/components/ui/upload_confirm";

// A simple local component for Label
const Label = ({ htmlFor, className, children }: any) => (
  <label htmlFor={htmlFor} className={`font-normal ${className}`}>
    {children}
  </label>
);

// Define the User interface inside this file if it's not already globally defined
interface User {
  id: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  adviser: string;
  schedule: string;
}

const SuperAdminUploadWhitelistPage = () => {
  const initialFormState = {
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    adviser: "",
    schedule: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [currentView, setCurrentView] = useState("Form");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(whitelistData as User[]);

  const filteredUsers = useMemo(() => {
    let currentUsers = users;
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentUsers = currentUsers.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    return currentUsers;
  }, [searchQuery, users]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAdviserChange = (value: any) => {
    setFormData({ ...formData, adviser: value });
  };

  const handleScheduleChange = (value: any) => {
    setFormData({ ...formData, schedule: value });
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
  };

  const handleClear = (fieldName: any) => {
    setFormData({ ...formData, [fieldName]: "" });
  };

  const handleSelectView = (view: string) => {
    setCurrentView(view);
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
    setEditingUser(null); // REVISED: Reset editing state on view change
  };

  const handleEditUser = (userId: number) => {
    const userToEdit = filteredUsers.find((user) => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
    }
  };

  // REVISED: New handler for saving the updated user
  const handleSaveUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
    setCurrentView("Whitelist"); // REVISED: Switch back to the whitelist view
  };

  // REVISED: New handler for canceling the edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    setCurrentView("Whitelist"); // REVISED: Switch back to the whitelist view
  };

  const placeholderText = {
    Form: "Search Form Here",
    Whitelist: "Search Whitelist Here",
  };

  const viewMap = {
    Form: (
      <>
        <div className="flex justify-center items-center">
          <Card className="w-full max-w-3xl center rounded-1px border-black shadow-lg shadow-gray-800/50">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
                  {/* Adviser Combobox */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="adviser" className="font-normal">
                      Adviser
                    </Label>
                    <Combobox
                      value={formData.adviser}
                      onValueChange={handleAdviserChange}
                      items={[
                        { value: "adviser1", label: "Monkey Luffy" },
                        { value: "adviser2", label: "Roronoa Zoro" },
                        { value: "adviser3", label: "Sanji Vinsmoke" },
                        { value: "adviser4", label: "Trafalgar Law" },
                        { value: "adviser5", label: "Nico Robin" },
                        { value: "adviser6", label: "Rob Lucci" },
                        { value: "adviser7", label: "Dracule Mihawk" },
                      ]}
                      placeholder={"Select Adviser"}
                    />
                  </div>
                  {/* Class Program Combobox */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="schedule" className="font-normal">
                      Class Program
                    </Label>
                    <Combobox
                      value={formData.schedule}
                      onValueChange={handleScheduleChange}
                      items={[
                        { value: "day", label: "Day Program" },
                        { value: "evening", label: "Evening Program" },
                      ]}
                      placeholder={"Select Program"}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-center gap-4 mt-6">
              <FileUpload />
              <Button
                onClick={handleClearAll}
                 className="bg-gray-200 text-gray font-serif rounded-1px shadow-md shadow-gray-500/80
              transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
              active:shadow-lg active:shadow-gray-700/90"
              >
                Clear Information
              </Button>
              
            <UploadWhitelistConfirm />
            </div>
          </Card>
        </div>
      </>
    ),
    Whitelist: (
      <WhitelistView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Whitelist}
        filteredUsers={filteredUsers}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onEditUser={handleEditUser}
      />
    ),
  };

  return (
    <>
      <main className="mt-4">
        <WhitelistNavigationBar
          activeView={currentView}
          onSelectView={handleSelectView}
        />
        <div className="mt-6 p-1">
          {/* REVISED: Corrected conditional rendering logic */}
          {editingUser ? (
            <EditWhitelistView
              user={editingUser as User} // REVISED: Corrected type name
              onSave={handleSaveUser}
              onCancel={handleCancelEdit}
            />
          ) : (
            viewMap[currentView as keyof typeof viewMap]
          )}
        </div>
      </main>
    </>
  );
};

export default SuperAdminUploadWhitelistPage;
