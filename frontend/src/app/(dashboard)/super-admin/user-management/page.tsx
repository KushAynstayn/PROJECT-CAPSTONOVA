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

import RestrictedAccounts from "../../../../components/user-manage/restricted-accounts";

import SuperAdminView from "../../../../components/user-manage/view-super-admin";
import EditSuperAdminView from "../../../../components/user-manage/edit-super-admin";
import AddSuperAdmin from "../../../../components/user-manage/add-super-admin";

import WhitelistView, {
  WhitelistItem,
} from "../../../../components/user-manage/view-whitelist";
import AddWhitelist from "../../../../components/user-manage/add-whitelist";
import EditWhitelist from "../../../../components/user-manage/edit-whitelist";

// --- Type and Interface definitions ---
type Role =
  | "Viewer"
  | "Proponents"
  | "Advisers"
  | "Admin"
  | "Super Admin"
  | "Restricted"
  | "Faculty Whitelist"; // ✅ RENAMED

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
  email: string;
}

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
  | Admin
  | WhitelistItem;

const placeholderText = {
  Viewer: "Search Viewers Here",
  Proponents: "Search Proponents Here",
  Advisers: "Search Advisers Here",
  Admin: "Search Admins Here",
  "Super Admin": "Search Super Admins Here",
  Restricted: "Search Restricted Accounts Here",
  "Faculty Whitelist": "Search Faculty Whitelist Here", // ✅ RENAMED KEY & TEXT
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
    "Super Admin": [],
    Restricted: [],
    "Faculty Whitelist": [], // ✅ RENAMED KEY
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

  const fetchSuperAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/user-mgt/super-admin?name=${searchQuery}`);
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

  const fetchWhitelist = useCallback(async () => {
    console.log("Fetching whitelist (mock)...");
    // Implementation ready for API integration
  }, []);

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
      case "Super Admin":
        fetchSuperAdmins();
        break;
      case "Faculty Whitelist": // ✅ RENAMED CASE
        fetchWhitelist();
        break;
      case "Restricted":
        break;
    }
  }, [
    currentRole,
    searchQuery,
    fetchViewers,
    fetchProponents,
    fetchAdvisers,
    fetchAdmins,
    fetchSuperAdmins,
    fetchWhitelist,
  ]);

  const handleEditUser = async (userIdOrItem: number | WhitelistItem) => {
    // ✅ RENAMED CHECK
    if (currentRole === "Faculty Whitelist") {
      setEditingUser(userIdOrItem as WhitelistItem);
      return;
    }

    const userId = userIdOrItem as number;
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
        endpoint = `/user-mgt/super-admin/${userId}`;

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
    // ✅ RENAMED CHECK
    if (currentRole === "Faculty Whitelist") {
      alert(`Deleted whitelist entry ID: ${userId} (Mock Action)`);
      return;
    }

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
      endpoint = `/user-mgt/super-admin/${userId}/restrict`;
      fetchAction = fetchSuperAdmins;
    }

    if (window.confirm(`Are you sure you want to restrict this ${roleName}?`)) {
      try {
        const method =
          currentRole === "Admin" || currentRole === "Super Admin"
            ? "PATCH"
            : "DELETE";

        await apiCall(endpoint, method);

        if (fetchAction) fetchAction();
      } catch (err: any) {
        const message =
          err instanceof ApiError
            ? err.message
            : `Failed to restrict ${roleName}.`;
        setError(message);
      }
    }
  };

  const handleAddUser = async (userData: any) => {
    // ✅ RENAMED CHECK
    if (currentRole === "Faculty Whitelist") {
      console.log("Mock Adding Whitelist:", userData);
      setIsAddModalOpen(false);
      alert("Added to whitelist (Mock Action)");
      return;
    }

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
      endpoint = "/user-mgt/super-admin";
      fetchAction = fetchSuperAdmins;
    }

    try {
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
    // ✅ RENAMED CHECK
    if (currentRole === "Faculty Whitelist") {
      console.log("Mock Saving Whitelist:", updatedUser);
      setEditingUser(null);
      alert("Whitelist updated (Mock Action)");
      return;
    }

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
      endpoint = `/user-mgt/super-admin/${updatedUser.id}`;
      payload = updatedUser as Admin;
      fetchAction = fetchSuperAdmins;
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
    // ✅ RENAMED KEY
    "Faculty Whitelist": (
      <WhitelistView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        onAdd={() => setIsAddModalOpen(true)}
        onEdit={(item) => handleEditUser(item)}
        onDelete={(id) => handleDeleteUser(id)}
      />
    ),
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

          {isAddModalOpen && currentRole === "Super Admin" && (
            <AddSuperAdmin
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddUser}
            />
          )}

          {/* ✅ RENAMED CHECK for Whitelist Modal */}
          {isAddModalOpen && currentRole === "Faculty Whitelist" && (
            <AddWhitelist
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
              {currentRole === "Super Admin" && (
                <EditSuperAdminView
                  user={editingUser as Admin}
                  onSave={handleSaveUser}
                  onCancel={handleCancelEdit}
                />
              )}
              {/* ✅ RENAMED CHECK for Whitelist Edit View */}
              {currentRole === "Faculty Whitelist" && (
                <EditWhitelist
                  item={editingUser as WhitelistItem}
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
