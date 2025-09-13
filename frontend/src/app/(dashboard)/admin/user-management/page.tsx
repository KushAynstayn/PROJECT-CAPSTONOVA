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
import proponentData from "@/data/proponent.json";
import adviserData from "@/data/adviser.json";
import { apiCall, ApiError } from "@/lib/api";

type Role = "Viewer" | "Proponents" | "Advisers";

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
interface Proponent extends BaseUser {
  name: string;
  idNumber: string;
  adviser: string;
  course: string;
  capstoneTitle: string;
  groupName: string;
  program: string;
}
interface Adviser extends BaseUser {
  name: string;
  idNumber: string;
  numberOfAdvisees: string;
  degreeProgram: string;
}
type User = Viewer | Proponent | Adviser;

const mockData = {
  Proponents: proponentData,
  Advisers: adviserData,
};

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
    Proponents: proponentData,
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

  useEffect(() => {
    if (currentRole === "Viewer") {
      fetchViewers();
    }
  }, [currentRole, fetchViewers]);

  const filteredUsers = useMemo(() => {
    if (currentRole !== "Viewer") {
      let currentUsers = users[currentRole] as (Proponent | Adviser)[];
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return currentUsers.filter((user) =>
          Object.values(user).some((val) =>
            String(val).toLowerCase().includes(lowerCaseQuery)
          )
        );
      }
      return currentUsers;
    }
    return users.Viewer;
  }, [currentRole, searchQuery, users]);

  const handleEditUser = (userId: number) => {
    const userToEdit = (users[currentRole] as User[]).find(
      (user) => user.id === userId
    );
    if (userToEdit) {
      setEditingUser(userToEdit);
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
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveUser = async (updatedUser: User) => {
    if (currentRole === "Viewer") {
      const viewerData = updatedUser as Viewer;
      const payload = {
        first_name: viewerData.first_name,
        last_name: viewerData.last_name,
        email: viewerData.email,
        student_id: viewerData.user_detail?.student_id,
        department: viewerData.user_detail?.department,
        program: viewerData.user_detail?.program,
      };

      try {
        await apiCall(`/admin/viewers/${updatedUser.id}`, "PUT", payload);
        fetchViewers();
      } catch (err) {
        setError("Failed to update viewer.");
      }
    } else {
      setUsers((prevUsers) => {
        const newUsersForRole = (prevUsers[currentRole] as User[]).map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        return { ...prevUsers, [currentRole]: newUsersForRole };
      });
    }
    setEditingUser(null);
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
        filteredUsers={filteredUsers as Proponent[]}
        onEditUser={handleEditUser}
        startDate={undefined}
        endDate={undefined}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
      />
    ),
    Advisers: (
      <AdviserView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Advisers}
        filteredUsers={filteredUsers as Adviser[]}
        onEditUser={handleEditUser}
        startDate={undefined}
        endDate={undefined}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
        onViewSuggestions={handleViewSuggestions}
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
                  user={editingUser as Proponent}
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
