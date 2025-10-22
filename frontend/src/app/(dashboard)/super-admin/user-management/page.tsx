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
import AddAdviser from "../../../../components/user-manage/add-adviser";
import AddAdmin from "../../../../components/user-manage/add-admin";
import { apiCall, ApiError } from "@/lib/api";

// ✅ NEW IMPORT — your Restricted Accounts component
import RestrictedAccounts from "../../../../components/user-manage/restricted-accounts";

// ✅ NEW IMPORTS --- for Super Admin
import SuperAdminView from "../../../../components/user-manage/view-super-admin";
import EditSuperAdminView from "../../../../components/user-manage/edit-super-admin";
import AddSuperAdmin from "../../../../components/user-manage/add-super-admin";

// --- Type and Interface definitions ---
// ✅ ADDED "Super Admin" to Role type
type Role =
  | "Viewer"
  | "Proponents"
  | "Advisers"
  | "Admin"
  | "Super Admin"
  | "Restricted";

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

interface Adviser extends BaseUser {
  name: string;
  advisees_count: number;
}

interface AdviserEditData {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
}

// ✅ This interface can be reused for Admin and Super Admin
interface Admin extends BaseUser {
  name: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
}

type User =
  | Viewer
  | ProponentListItem
  | ProponentEditData
  | Adviser
  | AdviserEditData
  | Admin;

const placeholderText = {
  Viewer: "Search Viewers Here",
  Proponents: "Search Proponents Here",
  Advisers: "Search Advisers Here",
  Admin: "Search Admins Here",
  "Super Admin": "Search Super Admins Here", // ✅ ADDED
  Restricted: "Search Restricted Accounts Here",
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
    "Super Admin": [], // ✅ ADDED
    Restricted: [],
  });
  const [viewingSuggestionsFor, setViewingSuggestionsFor] =
    useState<Adviser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Data Fetching Callbacks ---
  const fetchViewers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/user-mgt/viewers?search=${searchQuery}`);
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
      const data = await apiCall(`/user-mgt/proponents?search=${searchQuery}`);
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
      const data = await apiCall(`/user-mgt/advisers?name=${searchQuery}`);
      setUsers((prev) => ({ ...prev, Advisers: data }));
    } catch (err) {
      setError("Failed to fetch advisers.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/user-mgt/admin?name=${searchQuery}`);
      const formattedData = data.data.map((admin: any) => ({
        ...admin,
        name: `${admin.first_name} ${admin.last_name}`,
      }));
      setUsers((prev) => ({ ...prev, Admin: formattedData }));
    } catch (err) {
      setError("Failed to fetch admins.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // ✅ MODIFIED FUNCTION for fetching Super Admins (now uses API)
  const fetchSuperAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ Use the new endpoint
      const data = await apiCall(`/user-mgt/super-admin?name=${searchQuery}`);

      // ✅ Format data as the view component expects a 'name' field
      const formattedData = data.data.map((admin: any) => ({
        ...admin,
        name: `${admin.first_name} ${admin.last_name}`,
      }));
      setUsers((prev) => ({ ...prev, "Super Admin": formattedData }));
    } catch (err) {
      setError("Failed to fetch super admins.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setEditingUser(null);
    setViewingSuggestionsFor(null);

    switch (currentRole) {
      case "Viewer":
        fetchViewers();
        break;
      case "Proponents":
        fetchProponents();
        break;
      case "Advisers":
        fetchAdvisers();
        break;
      case "Admin":
        fetchAdmins();
        break;
      case "Super Admin": // ✅ ADDED
        fetchSuperAdmins();
        break;
      case "Restricted":
        // This component fetches its own data, so no call needed here.
        break;
    }
  }, [
    currentRole,
    searchQuery,
    fetchViewers,
    fetchProponents,
    fetchAdvisers,
    fetchAdmins,
    fetchSuperAdmins, // ✅ ADDED
  ]);

  const handleEditUser = async (userId: number) => {
    setError(null);
    setIsLoading(true);
    try {
      let endpoint = "";
      if (currentRole === "Viewer") endpoint = `/user-mgt/viewers/${userId}`;
      if (currentRole === "Proponents")
        endpoint = `/user-mgt/proponents/${userId}`;
      if (currentRole === "Advisers") endpoint = `/user-mgt/advisers/${userId}`;
      if (currentRole === "Admin") endpoint = `/user-mgt/admin/${userId}`;
      if (currentRole === "Super Admin")
        endpoint = `/user-mgt/super-admin/${userId}`; // ✅ ADDED

      if (endpoint) {
        // ✅ Removed mock logic, this now works for all roles
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
    if (currentRole === "Super Admin") roleName = "Super Admin";

    if (currentRole === "Viewer") {
      endpoint = `/user-mgt/viewers/${userId}`;
      fetchAction = fetchViewers;
    } else if (currentRole === "Proponents") {
      endpoint = `/user-mgt/proponents/${userId}`;
      fetchAction = fetchProponents;
    } else if (currentRole === "Advisers") {
      endpoint = `/user-mgt/advisers/${userId}`;
      fetchAction = fetchAdvisers;
    } else if (currentRole === "Admin") {
      endpoint = `/user-mgt/admin/${userId}/restrict`;
      fetchAction = fetchAdmins;
    } else if (currentRole === "Super Admin") {
      // ✅ ADDED
      endpoint = `/user-mgt/super-admin/${userId}/restrict`; // ✅ Use new endpoint
      fetchAction = fetchSuperAdmins;
    }

    if (window.confirm(`Are you sure you want to restrict this ${roleName}?`)) {
      try {
        const method =
          currentRole === "Admin" || currentRole === "Super Admin"
            ? "PATCH"
            : "DELETE";

        // ✅ Removed mock logic
        await apiCall(endpoint, method);

        if (fetchAction) fetchAction();
      } catch (err: any) {
        const message =
          err instanceof ApiError
            ? err.message
            : `Failed to restrict ${roleName}.`;
        // ✅ Display specific backend error if available (e.g., "You cannot restrict your own account.")
        setError(message);
      }
    }
  };

  const handleAddUser = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    let endpoint = "";
    let fetchAction: (() => void) | null = null;

    if (currentRole === "Proponents") {
      endpoint = "/user-mgt/proponents";
      fetchAction = fetchProponents;
    } else if (currentRole === "Advisers") {
      endpoint = "/user-mgt/advisers";
      fetchAction = fetchAdvisers;
    } else if (currentRole === "Admin") {
      endpoint = "/user-mgt/admin";
      fetchAction = fetchAdmins;
    } else if (currentRole === "Super Admin") {
      // ✅ ADDED
      endpoint = "/user-mgt/super-admin"; // ✅ Use new endpoint
      fetchAction = fetchSuperAdmins;
    }

    try {
      // ✅ Removed mock logic
      await apiCall(endpoint, "POST", userData);

      setIsAddModalOpen(false);
      if (fetchAction) fetchAction();
    } catch (err: any) {
      const message =
        err instanceof ApiError ? err.message : "An unexpected error occurred.";
      alert(`Failed to add user: ${message}`);
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
      endpoint = `/user-mgt/viewers/${updatedUser.id}`;
      const viewerData = updatedUser as Viewer;
      payload = {
        first_name: viewerData.first_name,
        last_name: viewerData.last_name,
        email: viewerData.email,
        ...viewerData.user_detail,
      };
      fetchAction = fetchViewers;
    } else if (currentRole === "Proponents") {
      endpoint = `/user-mgt/proponents/${updatedUser.id}`;
      payload = updatedUser as ProponentEditData;
      fetchAction = fetchProponents;
    } else if (currentRole === "Advisers") {
      endpoint = `/user-mgt/advisers/${updatedUser.id}`;
      payload = updatedUser as AdviserEditData;
      fetchAction = fetchAdvisers;
    } else if (currentRole === "Admin") {
      endpoint = `/user-mgt/admin/${updatedUser.id}`;
      payload = updatedUser as Admin;
      fetchAction = fetchAdmins;
    } else if (currentRole === "Super Admin") {
      // ✅ ADDED
      endpoint = `/user-mgt/super-admin/${updatedUser.id}`; // ✅ Use new endpoint
      payload = updatedUser as Admin; // Can reuse Admin interface
      fetchAction = fetchSuperAdmins;
    }

    try {
      // ✅ Removed mock logic
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

  // --- Component Map ---
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
        onEditUser={handleEditUser}
        onViewSuggestions={handleViewSuggestions}
        onDeleteUser={handleDeleteUser}
        onAddUser={() => setIsAddModalOpen(true)}
      />
    ),
    Admin: (
      <AdminView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Admin}
        filteredUsers={users.Admin as Admin[]}
        onEditUser={handleEditUser}
        onAddUser={() => setIsAddModalOpen(true)}
        onDeleteUser={handleDeleteUser}
      />
    ),
    // ✅ NEW TAB: Super Admin
    "Super Admin": (
      <SuperAdminView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText["Super Admin"]}
        filteredUsers={users["Super Admin"] as Admin[]}
        onEditUser={handleEditUser}
        onAddUser={() => setIsAddModalOpen(true)}
        onDeleteUser={handleDeleteUser}
      />
    ),
    // ✅ NEW TAB: Restricted
    Restricted: <RestrictedAccounts />,
  };

  return (
    <>
      <main className="mt-0">
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
              onAdd={handleAddUser}
            />
          )}

          {isAddModalOpen && currentRole === "Advisers" && (
            <AddAdviser
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddUser}
            />
          )}

          {isAddModalOpen && currentRole === "Admin" && (
            <AddAdmin
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddUser}
            />
          )}

          {/* ✅ ADDED Modal for Super Admin */}
          {isAddModalOpen && currentRole === "Super Admin" && (
            <AddSuperAdmin
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddUser}
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
              {currentRole === "Admin" && (
                <EditAdminView
                  user={editingUser as Admin}
                  onSave={handleSaveUser}
                  onCancel={handleCancelEdit}
                />
              )}
              {/* ✅ ADDED Edit View for Super Admin */}
              {currentRole === "Super Admin" && (
                <EditSuperAdminView
                  user={editingUser as Admin} // Can reuse Admin interface
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
