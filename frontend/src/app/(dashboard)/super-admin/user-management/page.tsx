"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import NavigationBar, {
  Role as NavRole,
} from "@/components/ui/user-management-navbar";
import ViewerView from "../../../../components/user-manage/viewerView";
import ProponentView from "../../../../components/user-manage/view-proponent";
import AdviserView from "../../../../components/user-manage/view-adviser";
import AdminView from "../../../../components/user-manage/view-admin";
import EditViewerView from "../../../../components/user-manage/editViewer";
import EditProponentView from "../../../../components/user-manage/edit-proponent";
import EditAdviserView from "../../../../components/user-manage/edit-adviser";
import EditAdminView from "../../../../components/user-manage/edit-admin";
import SuggestionView from "../../../../components/user-manage/view-suggestion";
import AddProponent from "../../../../components/user-manage/add-proponent";
import { apiCall, ApiError } from "@/lib/api";

// --- Type and Interface definitions ---
type Role = "Viewer" | "Proponents" | "Advisers" | "Admin";

interface BaseUser {
  id: number;
  email: string;
}

interface Viewer extends BaseUser {
  first_name: string;
  last_name: string;
  user_detail: {
    student_id: string;
    department: string;
    program: string;
  } | null;
}

interface ProponentListItem extends BaseUser {
  name: string;
  idNumber: string;
  course: string;
  adviser: string;
}

interface ProponentEditData extends BaseUser {
  first_name: string;
  last_name: string;
  student_id: string;
  department: string;
  program: string;
  adviser_id: number | null;
}

interface Adviser extends BaseUser {
  name: string;
  idNumber: string;
  numberOfAdvisees: string;
  degreeProgram: string;
}

interface Admin extends BaseUser {
  name: string;
  idNumber: string;
  branch: string;
  department: string;
}

type User = Viewer | ProponentListItem | ProponentEditData | Adviser | Admin;

const placeholderText = {
  Viewer: "Search Viewers Here",
  Proponents: "Search Proponents Here",
  Advisers: "Search Advisers Here",
  Admin: "Search Admins Here",
};

const SuperAdminUserManagementPage = () => {
  const [currentRole, setCurrentRole] = useState<Role>("Viewer");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<Role, User[]>>({
    Viewer: [],
    Proponents: [],
    Advisers: [],
    Admin: [],
  });
  const [viewingSuggestionsFor, setViewingSuggestionsFor] =
    useState<Adviser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchViewers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/super-admin/viewers?search=${searchQuery}`);
      setUsers((prev) => ({ ...prev, Viewer: data.data }));
    } catch (err) {
      setError("Failed to fetch viewers.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const fetchProponents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(
        `/super-admin/proponents?search=${searchQuery}`
      );
      setUsers((prev) => ({ ...prev, Proponents: data.data }));
    } catch (err) {
      setError("Failed to fetch proponents.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setEditingUser(null);
    setViewingSuggestionsFor(null);

    if (currentRole === "Viewer") fetchViewers();
    if (currentRole === "Proponents") fetchProponents();
  }, [currentRole, searchQuery, fetchViewers, fetchProponents]);

  const handleEditUser = async (userId: number) => {
    setError(null);
    setIsLoading(true);
    try {
      let endpoint = "";
      if (currentRole === "Viewer") endpoint = `/super-admin/viewers/${userId}`;
      if (currentRole === "Proponents")
        endpoint = `/super-admin/proponents/${userId}`;

      if (endpoint) {
        const userToEdit = await apiCall(endpoint);
        setEditingUser({ id: userId, ...userToEdit });
      }
    } catch (err) {
      setError(`Failed to fetch user details for editing.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    let endpoint = "";
    let fetchAction: (() => void) | null = null;
    let roleName = currentRole.slice(0, -1);

    if (currentRole === "Viewer") {
      endpoint = `/super-admin/viewers/${userId}`;
      fetchAction = fetchViewers;
    } else if (currentRole === "Proponents") {
      endpoint = `/super-admin/proponents/${userId}`;
      fetchAction = fetchProponents;
    }

    if (window.confirm(`Are you sure you want to restrict this ${roleName}?`)) {
      try {
        await apiCall(endpoint, "DELETE");
        if (fetchAction) fetchAction();
      } catch (err) {
        setError(`Failed to restrict ${roleName}.`);
      }
    }
  };

  const handleAddProponent = async (proponentData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCall("/super-admin/proponents", "POST", proponentData);
      setIsAddModalOpen(false);
      fetchProponents();
    } catch (err: any) {
      const message =
        err instanceof ApiError ? err.message : "An unexpected error occurred.";
      alert(`Failed to add proponent: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => setEditingUser(null);

  const handleSaveUser = async (updatedUser: User) => {
    setEditingUser(null);
    setError(null);
    setIsLoading(true);

    let endpoint = "";
    let payload: any = {};
    let fetchAction: (() => void) | null = null;

    if (currentRole === "Viewer") {
      endpoint = `/super-admin/viewers/${updatedUser.id}`;
      payload = updatedUser as Viewer;
      fetchAction = fetchViewers;
    } else if (currentRole === "Proponents") {
      endpoint = `/super-admin/proponents/${updatedUser.id}`;
      payload = updatedUser as ProponentEditData;
      fetchAction = fetchProponents;
    }

    try {
      await apiCall(endpoint, "PUT", payload);
      if (fetchAction) fetchAction();
    } catch (err) {
      setError(`Failed to update ${currentRole.slice(0, -1)}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSuggestions = (adviser: Adviser) =>
    setViewingSuggestionsFor(adviser);
  const handleCloseSuggestions = () => setViewingSuggestionsFor(null);

  const componentMap = {
    Viewer: (
      <ViewerView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Viewer}
        filteredUsers={users.Viewer as Viewer[]}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        isLoading={isLoading}
      />
    ),
    Proponents: (
      <ProponentView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Proponents}
        filteredUsers={users.Proponents as ProponentListItem[]}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onAddUser={() => setIsAddModalOpen(true)}
      />
    ),
    Advisers: (
      <AdviserView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Advisers}
        filteredUsers={users.Advisers as Adviser[]}
        onEditUser={() => {}}
        onViewSuggestions={handleViewSuggestions}
        onDeleteUser={() => {}}
        onAddUser={() => {}}
      />
    ),
    Admin: (
      <AdminView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Admin}
        filteredUsers={users.Admin as Admin[]}
        onEditUser={() => {}}
      />
    ),
  };

  return (
    <>
      <main className="mt-4">
        <NavigationBar
          activeRole={currentRole as NavRole}
          onSelectRole={(role) => {
            setCurrentRole(role as Role);
            setSearchQuery("");
            setEditingUser(null);
            setViewingSuggestionsFor(null);
          }}
        />
        <div className="mt-6 p-1">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {isAddModalOpen && currentRole === "Proponents" && (
            <AddProponent
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddProponent}
            />
          )}

          {viewingSuggestionsFor && currentRole === "Advisers" ? (
            <SuggestionView
              adviser={viewingSuggestionsFor}
              onClose={handleCloseSuggestions}
            />
          ) : editingUser ? (
            <>
              {currentRole === "Viewer" && (
                <EditViewerView
                  user={editingUser as Viewer}
                  onSave={handleSaveUser}
                  onCancel={handleCancelEdit}
                />
              )}
              {currentRole === "Proponents" && (
                <EditProponentView
                  user={editingUser as ProponentEditData}
                  onSave={handleSaveUser}
                  onCancel={handleCancelEdit}
                />
              )}
            </>
          ) : (
            componentMap[currentRole]
          )}
        </div>
      </main>
    </>
  );
};

export default SuperAdminUserManagementPage;
