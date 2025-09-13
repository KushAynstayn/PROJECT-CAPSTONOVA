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
import adviserData from "@/data/adviser.json";
import { apiCall, ApiError } from "@/lib/api";

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

// Interface for the list view, matching the new backend response
interface ProponentListItem extends BaseUser {
  name: string;
  id_number: string;
  department: string;
  program: string;
  adviser: string;
}

// Interface for the edit view, which might have a different structure
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

type User = Viewer | ProponentListItem | ProponentEditData | Adviser;

const placeholderText = {
  Viewer: "Search Viewers Here",
  Proponents: "Search Proponents Here",
  Advisers: "Search Advisers Here",
};

const AdminUserManagementPage = () => {
  const [currentRole, setCurrentRole] = useState<Role>("Viewer");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<Role, User[] | []>>({
    Viewer: [],
    Proponents: [],
    Advisers: adviserData,
  });
  const [viewingSuggestionsFor, setViewingSuggestionsFor] =
    useState<Adviser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchViewers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/admin/viewers?search=${searchQuery}`);
      setUsers((prevUsers) => ({ ...prevUsers, Viewer: data.data }));
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
      setUsers((prevUsers) => ({ ...prevUsers, Proponents: data.data }));
    } catch (err) {
      setError("Failed to fetch proponents.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (currentRole === "Viewer") {
      fetchViewers();
    } else if (currentRole === "Proponents") {
      fetchProponents();
    }
  }, [currentRole, searchQuery, fetchViewers, fetchProponents]);

  const handleEditUser = async (userId: number) => {
    setError(null);
    setIsLoading(true);
    try {
      let userToEdit;
      if (currentRole === "Proponents") {
        userToEdit = await apiCall(`/admin/proponents/${userId}`);
      } else {
        // Logic for other roles if they also need fetching for edit
        userToEdit = (users[currentRole] as User[]).find(
          (user) => user.id === userId
        );
      }

      if (userToEdit) {
        setEditingUser(userToEdit);
      } else {
        setError("Could not find user data to edit.");
      }
    } catch (err) {
      setError("Failed to fetch user details for editing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (currentRole === "Viewer") {
      try {
        await apiCall(`/admin/viewers/${userId}`, "DELETE");
        fetchViewers();
      } catch (err) {
        setError("Failed to restrict viewer.");
      }
    } else if (currentRole === "Proponents") {
      try {
        await apiCall(`/admin/proponents/${userId}`, "DELETE");
        fetchProponents();
      } catch (err) {
        setError("Failed to restrict proponent.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveUser = async (updatedUser: User) => {
    setEditingUser(null);
    setError(null);
    setIsLoading(true);

    let endpoint = "";
    let payload: any = {};
    let fetchAction: (() => void) | null = null;

    if (currentRole === "Viewer") {
      endpoint = `/admin/viewers/${updatedUser.id}`;
      const viewerData = updatedUser as Viewer;
      payload = {
        first_name: viewerData.first_name,
        last_name: viewerData.last_name,
        email: viewerData.email,
        student_id: viewerData.user_detail?.student_id,
        department: viewerData.user_detail?.department,
        program: viewerData.user_detail?.program,
      };
      fetchAction = fetchViewers;
    } else if (currentRole === "Proponents") {
      endpoint = `/admin/proponents/${updatedUser.id}`;
      const proponentData = updatedUser as ProponentEditData;
      payload = {
        first_name: proponentData.first_name,
        last_name: proponentData.last_name,
        email: proponentData.email,
        student_id: proponentData.student_id,
        department: proponentData.department,
        program: proponentData.program,
        adviser_id: proponentData.adviser_id,
      };
      fetchAction = fetchProponents;
    }

    try {
      if (endpoint) {
        await apiCall(endpoint, "PUT", payload);
        if (fetchAction) fetchAction();
      }
    } catch (err) {
      setError(`Failed to update ${currentRole}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSuggestions = (adviser: Adviser) => {
    setViewingSuggestionsFor(adviser);
  };

  const handleCloseSuggestions = () => {
    setViewingSuggestionsFor(null);
  };

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
        startDate={undefined}
        endDate={undefined}
        onStartDateChange={function (date: Date | undefined): void {
          throw new Error("Function not implemented.");
        }}
        onEndDateChange={function (date: Date | undefined): void {
          throw new Error("Function not implemented.");
        }}
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
          {error && <p className="text-red-500">{error}</p>}
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
                  user={editingUser as Adviser}
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
