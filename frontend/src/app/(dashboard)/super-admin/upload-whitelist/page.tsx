"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "@/components/ui/inputWithClear";
// Combobox component is temporarily disabled - needs to be fixed
import WhitelistNavigationBar from "@/components/ui/whitelist-navbar";
import WhitelistView from "../../../../components/whitelist/view-whitelist";
import whitelistData from "@/data/whitelist.json";
import EditWhitelistView from "../../../../components/whitelist/edit-whitelist";
// FileUpload component is temporarily disabled - needs to be fixed
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

  const handleAdviserChange = (e: any) => {
    setFormData({ ...formData, adviser: e.target.value });
  };

  const handleScheduleChange = (e: any) => {
    setFormData({ ...formData, schedule: e.target.value });
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
    setEditingUser(null);
  };

  const handleEditUser = (userId: number) => {
    const userToEdit = filteredUsers.find((user) => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
    }
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
    setCurrentView("Whitelist");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setCurrentView("Whitelist");
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
                  {/* Adviser Input (replaced Combobox) */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="adviser" className="font-normal">
                      Adviser
                    </Label>
                    <input
                      id="adviser"
                      placeholder="Select Adviser"
                      value={formData.adviser}
                      onChange={handleAdviserChange}
                      className="rounded-none border-[rgba(0,0,0,0.5)] p-2 border w-full"
                    />
                  </div>
                  {/* Class Program Input (replaced Combobox) */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="schedule" className="font-normal">
                      Class Program
                    </Label>
                    <input
                      id="schedule"
                      placeholder="Select Program"
                      value={formData.schedule}
                      onChange={handleScheduleChange}
                      className="rounded-none border-[rgba(0,0,0,0.5)] p-2 border w-full"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-center gap-4 mt-6">
              {/* File Upload Input (replaced FileUpload component) */}
              <input
                type="file"
                className="bg-gray-200 text-gray font-serif rounded-1px shadow-md shadow-gray-500/80 p-2
                transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
                active:shadow-lg active:shadow-gray-700/90 cursor-pointer"
              />
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
          {editingUser ? (
            <EditWhitelistView
              user={editingUser as User}
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
