"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import WhitelistNavigationBar from "@/components/ui/whitelist-navbar";
import WhitelistView from "../../../../components/whitelist/view-whitelist";
import EditWhitelistView from "../../../../components/whitelist/edit-whitelist";
import { apiCall, ApiError } from "@/lib/api";
import { DeleteConfirmationModal } from "../../../../components/whitelist/delete-confirmation-modal";

const Label = ({ htmlFor, className, children }: any) => (
  <label htmlFor={htmlFor} className={`font-normal ${className}`}>
    {children}
  </label>
);

interface WhitelistEntry {
  whitelist_id: number;
  student_id: string;
  student_email: string;
  adviser_name: string;
}

interface WhitelistEditData {
  whitelist_id: number;
  student_id: string;
  student_email: string;
  adviser_id: number;
}

interface Adviser {
  id: number;
  full_name: string;
}

const SuperAdminUploadWhitelistPage = () => {
  const initialFormState = {
    student_email: "",
    student_id: "",
    adviser_id: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [currentView, setCurrentView] = useState("Form");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<WhitelistEditData | null>(
    null
  );
  const [users, setUsers] = useState<WhitelistEntry[]>([]);
  const [advisers, setAdvisers] = useState<Adviser[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState<WhitelistEntry | null>(null);

  const fetchWhitelist = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `/user-mgt/whitelist?search=${searchQuery}`
        : "/user-mgt/whitelist";
      const response = await apiCall(url);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch whitelist", error);
      setError("Could not load whitelist data.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (currentView === "Whitelist") {
      fetchWhitelist();
    }
  }, [currentView, fetchWhitelist]);

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const response = await apiCall("/util/advisers");
        if (response.success) setAdvisers(response.data);
      } catch (error) {
        console.error("Failed to fetch advisers:", error);
      }
    };
    fetchAdvisers();
  }, []);

  const handleManualSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    const payload = {
      entries: [
        {
          student_email: formData.student_email,
          student_id: parseInt(formData.student_id, 10),
          adviser_id: parseInt(formData.adviser_id, 10),
        },
      ],
    };

    try {
      await apiCall("/user-mgt/whitelist", "POST", payload);
      setSuccess("Whitelist entry added successfully!");
      handleClearAll();
      fetchWhitelist();
    } catch (err: any) {
      setError(
        err instanceof ApiError ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcelUpload = async () => {
    if (!selectedFile) return setError("Please select a file to upload.");
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);
    try {
      await apiCall(
        "/user-mgt/whitelist/upload-excel",
        "POST",
        uploadFormData,
        true
      );
      setSuccess("Whitelist uploaded successfully!");
      setSelectedFile(null);
      fetchWhitelist();
    } catch (err: any) {
      // --- DEBUG MESSAGE ADDED ---
      console.error("Excel upload failed. Full error:", err);
      // --- END OF DEBUG MESSAGE ---
      setError(
        err instanceof ApiError ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (userId: number) => {
    try {
      const userData = await apiCall(`/user-mgt/whitelist/${userId}`);
      setEditingUser(userData);
    } catch (error) {
      setError("Failed to fetch user data for editing.");
    }
  };

  const handleSaveUser = async (updatedUser: {
    whitelist_id: number;
    student_id: number;
    student_email: string;
    adviser_id: number;
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiCall(`/user-mgt/whitelist/${updatedUser.whitelist_id}`, "PUT", {
        student_email: updatedUser.student_email,
        student_id: updatedUser.student_id,
        adviser_id: updatedUser.adviser_id,
      });
      setEditingUser(null);
      setCurrentView("Whitelist");
      await fetchWhitelist();
    } catch (error) {
      setError("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (userId: number) => {
    const userToDelete = users.find((user) => user.whitelist_id === userId);
    if (userToDelete) {
      setDeletingUser(userToDelete);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingUser) {
      try {
        await apiCall(
          `/user-mgt/whitelist/${deletingUser.whitelist_id}`,
          "DELETE"
        );
        setDeletingUser(null);
        await fetchWhitelist();
      } catch (error) {
        setError("Failed to delete entry.");
        setDeletingUser(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setCurrentView("Whitelist");
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
    setError(null);
    setSuccess(null);
  };
  const handleClear = (field: string) =>
    setFormData((prev) => ({ ...prev, [field]: "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleAdviserChange = (id: string) =>
    setFormData({ ...formData, adviser_id: id });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedFile(e.target.files?.[0] || null);

  return (
    <main className="mt-0">
      <WhitelistNavigationBar
        activeView={currentView}
        onSelectView={setCurrentView}
      />
      <div className="mt-6 p-1">
        {editingUser ? (
          <EditWhitelistView
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={handleCancelEdit}
          />
        ) : currentView === "Form" ? (
          <div className="flex justify-center items-center">
            <Card className="w-full max-w-3xl center rounded-md border-gray-300 shadow-md">
              <CardHeader className="p-0 pt-1 pb-0">
                <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
                  WHITELIST
                </CardTitle>
              </CardHeader>
              <div className="w-3/5 mx-auto mb-1">
                <Separator className="bg-gray-300" />
              </div>
              <CardContent className="pt-1 px-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="student_email" className="font-normal">
                        Email
                      </Label>
                      <InputWithClear
                        id="student_email"
                        placeholder="juan.delacruz@ctu.edu.ph"
                        value={formData.student_email}
                        onChange={handleChange}
                        onClear={() => handleClear("student_email")}
                        className="rounded-md border-gray-300 shadow-md"
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="student_id" className="font-normal">
                        ID Number
                      </Label>
                      <InputWithClear
                        id="student_id"
                        placeholder="123456789"
                        value={formData.student_id}
                        onChange={handleChange}
                        onClear={() => handleClear("student_id")}
                       className="rounded-md border-gray-300 shadow-md"
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5 md:col-span-2">
                      <Label htmlFor="adviser_id" className="font-normal">
                        Adviser
                      </Label>
                      <SearchableCombobox
                        value={formData.adviser_id}
                        onValueChange={handleAdviserChange}
                        items={advisers.map((adviser) => ({
                          value: adviser.id.toString(),
                          label: adviser.full_name,
                        }))}
                        placeholder={"Select Adviser"}
                        className="rounded-md border-gray-300 shadow-md"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <div className="px-6 py-2 text-center min-h-[24px]">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
              </div>
              <div className="flex flex-wrap justify-center items-center gap-2 mt-2 py-4 px-6 border-none">
                <div className="relative">
                  <Button
                    asChild
                    size="sm"
                    className="cursor-pointer bg-[#660000] text-white hover:bg-[#751717] active:bg-[#751717] transition-transform hover:scale-105"
                  >
                    <label htmlFor="file-upload">
                      {selectedFile ? selectedFile.name : "Choose File"}
                    </label>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <Button
                  onClick={handleExcelUpload}
                  disabled={isSubmitting || !selectedFile}
                  size="sm"
                  className="cursor-pointer bg-[#660000] text-white hover:bg-[#751717] active:bg-[#751717] transition-transform hover:scale-105"
                >
                  {isSubmitting ? "Uploading..." : "Upload Excel"}
                </Button>
                <Button
                  onClick={handleClearAll}
                  className="cursor-pointer bg-[#660000] text-white hover:bg-[#751717] active:bg-[#751717] transition-transform hover:scale-105"
                  size="sm"
                >
                  Clear Information
                </Button>
                <Button
                  onClick={handleManualSubmit}
                  className="cursor-pointer bg-[#660000] text-white hover:bg-[#751717] active:bg-[#751717] transition-transform hover:scale-105"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Whitelist"}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <WhitelistView
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder={"Search by student email..."}
            filteredUsers={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteClick}
          />
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={!!deletingUser}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingUser(null)}
        itemName={deletingUser?.student_email || ""}
      />
    </main>
  );
};

export default SuperAdminUploadWhitelistPage;
