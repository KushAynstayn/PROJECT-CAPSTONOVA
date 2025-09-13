"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import NavigationBar, {
  Role as NavRole,
} from "@/components/ui/admin-userman-navbar";
import ViewerView from "../../../../components/user-manage/viewerView";
import ProponentView from "../../../../components/admin-userman/proponentview";
import AdviserView from "../../../../components/user-manage/view-adviser";
import EditViewerView from "../../../../components/user-manage/editViewer";
import EditProponentView from "../../../../components/user-manage/edit-proponent";
import EditAdviserView from "../../../../components/user-manage/edit-adviser";
import SuggestionView from "../../../../components/user-manage/view-suggestion";
import { apiCall, ApiError } from "@/lib/api";
import AddAdviser from "@/components/user-manage/add-adviser";

type Role = "Viewer" | "Proponents" | "Advisers";

// --- INTERFACE DEFINITIONS ---
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
  id_number: string;
  department: string;
  program: string;
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

interface Adviser {
  id: number;
  name: string;
  email: string;
  advisees_count: number;
}

interface AdviserEditData {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
}

type User =
  | Viewer
  | ProponentListItem
  | ProponentEditData
  | Adviser
  | AdviserEditData;

const placeholderText = {
  Viewer: "Search Viewers Here",
  Proponents: "Search Proponents Here",
  Advisers: "Search Advisers Here",
};

const AdminUserManagementPage = () => {
  const [currentRole, setCurrentRole] = useState<Role>("Advisers");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<Role, User[]>>({
    Viewer: [],
    Proponents: [],
    Advisers: [],
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
      const data = await apiCall(`/admin/viewers?search=${searchQuery}`);
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
      const data = await apiCall(`/admin/proponents?search=${searchQuery}`);
      setUsers((prev) => ({ ...prev, Proponents: data.data }));
    } catch (err) {
      setError("Failed to fetch proponents.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const fetchAdvisers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/admin/advisers?name=${searchQuery}`);
      setUsers((prev) => ({ ...prev, Advisers: data }));
    } catch (err) {
      setError("Failed to fetch advisers.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setEditingUser(null);
    setViewingSuggestionsFor(null);

    if (currentRole === "Viewer") fetchViewers();
    if (currentRole === "Proponents") fetchProponents();
    if (currentRole === "Advisers") fetchAdvisers();
  }, [currentRole, searchQuery, fetchViewers, fetchProponents, fetchAdvisers]);

  const handleEditUser = async (userId: number) => {
    setError(null);
    setIsLoading(true);
    try {
      let endpoint = "";
      if (currentRole === "Viewer") endpoint = `/admin/viewers/${userId}`;
      if (currentRole === "Proponents")
        endpoint = `/admin/proponents/${userId}`;
      if (currentRole === "Advisers") endpoint = `/admin/advisers/${userId}`;

      const userToEdit = await apiCall(endpoint);
      setEditingUser({ id: userId, ...userToEdit });
    } catch (err) {
      setError(`Failed to fetch user details for editing.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    let endpoint = "";
    let fetchAction: (() => void) | null = null;

    if (currentRole === "Viewer") {
      endpoint = `/admin/viewers/${userId}`;
      fetchAction = fetchViewers;
    }
    if (currentRole === "Proponents") {
      endpoint = `/admin/proponents/${userId}`;
      fetchAction = fetchProponents;
    }
    if (currentRole === "Advisers") {
      endpoint = `/admin/advisers/${userId}`;
      fetchAction = fetchAdvisers;
    }

    if (
      window.confirm(
        `Are you sure you want to restrict this ${currentRole.slice(0, -1)}?`
      )
    ) {
      try {
        await apiCall(endpoint, "DELETE");
        if (fetchAction) fetchAction();
      } catch (err) {
        setError(`Failed to restrict ${currentRole.slice(0, -1)}.`);
      }
    }
  };

  const handleAddAdviser = async (adviserData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCall("/admin/advisers", "POST", adviserData);
      setIsAddModalOpen(false);
      fetchAdvisers();
    } catch (err: any) {
      const message =
        err instanceof ApiError ? err.message : "An unexpected error occurred.";
      alert(`Failed to add adviser: ${message}`); // Simple alert for feedback
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
      endpoint = `/admin/viewers/${updatedUser.id}`;
      payload = updatedUser as Viewer;
      fetchAction = fetchViewers;
    } else if (currentRole === "Proponents") {
      endpoint = `/admin/proponents/${updatedUser.id}`;
      payload = updatedUser as ProponentEditData;
      fetchAction = fetchProponents;
    } else if (currentRole === "Advisers") {
      endpoint = `/admin/advisers/${updatedUser.id}`;
      payload = updatedUser as AdviserEditData;
      fetchAction = fetchAdvisers;
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
        isLoading={isLoading}
      />
    ),
    Advisers: (
      <AdviserView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Advisers}
        filteredUsers={users.Advisers as Adviser[]}
        onEditUser={handleEditUser}
        onViewSuggestions={handleViewSuggestions}
        onDeleteUser={handleDeleteUser}
        onAddUser={() => setIsAddModalOpen(true)}
      />
    ),
  };

  return (
    <>
      <main className="mt-4">
        <NavigationBar
          activeRole={currentRole as NavRole}
          onSelectRole={(role) => setCurrentRole(role as Role)}
        />
        <div className="mt-6 p-1">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {isAddModalOpen && currentRole === "Advisers" && (
            <AddAdviser
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddAdviser}
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
              {currentRole === "Advisers" && (
                <EditAdviserView
                  user={editingUser as AdviserEditData}
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

export default AdminUserManagementPage;
