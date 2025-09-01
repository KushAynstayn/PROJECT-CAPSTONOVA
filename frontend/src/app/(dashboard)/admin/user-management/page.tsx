"use client";

import React, { useState, useMemo } from "react";
import { isWithinInterval } from "date-fns";
import NavigationBar, {
  Role as NavRole,
} from "@/components/ui/admin-userman-navbar";
import GuestView from "../../../../components/user-manage/viewGuest";
import ProponentView from "../../../../components/admin-userman/proponentview";
import AdviserView from "../../../../components/user-manage/view-adviser";
// REMOVED: AdminView component
// import AdminView from "../../../../components/user-manage/view-admin";
import EditGuestView from "../../../../components/user-manage/editGuest";
import EditProponentView from "../../../../components/user-manage/edit-proponent";
import EditAdviserView from "../../../../components/user-manage/edit-adviser";
// REMOVED: EditAdminView component
// import EditAdminView from "../../../../components/user-manage/edit-admin";
import SuggestionView from "../../../../components/user-manage/view-suggestion";
import guestData from "@/data/guest.json";
import proponentData from "@/data/proponent.json";
import adviserData from "@/data/adviser.json";
// REMOVED: adminData as it's no longer used
// import adminData from "@/data/admin.json";

// --- Type and Interface definitions ---
// UPDATED: The 'Admin' role has been removed from the Role type
type Role = "Guest" | "Proponents" | "Advisers";

interface BaseUser {
  id: number;
  name: string;
  email: string;
  idNumber: string;
}
interface Guest extends BaseUser {
  course: string;
  dateRequested: string;
  program: string;
}
interface Proponent extends BaseUser {
  adviser: string;
  course: string;
  capstoneTitle: string;
  groupName: string;
  program: string;
}
interface Adviser extends BaseUser {
  numberOfAdvisees: string;
  degreeProgram: string;
}
// REMOVED: The Admin interface is no longer needed
// interface Admin extends BaseUser {
//   branch: string;
//   department: string;
// }
// UPDATED: The 'Admin' role has been removed from the User type
type User = Guest | Proponent | Adviser;
// --- End of Type and Interface definitions ---

// UPDATED: The 'Admin' key has been removed from the mockData object
const mockData = {
  Guest: guestData,
  Proponents: proponentData,
  Advisers: adviserData,
};

// UPDATED: The 'Admin' key has been removed from the placeholderText object
const placeholderText = {
  Guest: "Search Guests Here",
  Proponents: "Search Proponents Here",
  Advisers: "Search Advisers Here",
};

const SuperAdminUserManagementPage = () => {
  const [currentRole, setCurrentRole] = useState<Role>("Guest");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<Role, User[] | []>>(mockData);
  const [viewingSuggestionsFor, setViewingSuggestionsFor] =
    useState<Adviser | null>(null);

  const filteredUsers = useMemo(() => {
    let currentUsers = users[currentRole] as User[];
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentUsers = currentUsers.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    if (startDate && endDate && currentRole === "Guest") {
      currentUsers = currentUsers.filter((user) => {
        if ("dateRequested" in user) {
          const userDate = new Date(user.dateRequested);
          return isWithinInterval(userDate, { start: startDate, end: endDate });
        }
        return false;
      });
    }
    return currentUsers;
  }, [currentRole, searchQuery, startDate, endDate, users]);

  const handleEditUser = (userId: number) => {
    const userToEdit = filteredUsers.find((user) => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prevUsers) => {
      const newUsersForRole = (prevUsers[currentRole] as User[]).map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ) as User[];
      return { ...prevUsers, [currentRole]: newUsersForRole };
    });
    setEditingUser(null);
  };

  const handleViewSuggestions = (adviser: Adviser) => {
    setViewingSuggestionsFor(adviser);
  };

  const handleCloseSuggestions = () => {
    setViewingSuggestionsFor(null);
  };

  // UPDATED: The 'Admin' key has been removed from the componentMap
  const componentMap = {
    Guest: (
      <GuestView
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder={placeholderText.Guest}
        filteredUsers={filteredUsers as Guest[]}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onEditUser={handleEditUser}
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
            setStartDate(undefined);
            setEndDate(undefined);
            setEditingUser(null);
            setViewingSuggestionsFor(null);
          }}
        />
        <div className="mt-6 p-1">
          {viewingSuggestionsFor && currentRole === "Advisers" ? (
            <SuggestionView
              adviser={viewingSuggestionsFor}
              onClose={handleCloseSuggestions}
            />
          ) : editingUser ? (
            <>
              {currentRole === "Guest" && (
                <EditGuestView
                  user={editingUser as Guest}
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
              {/* REMOVED: The conditional rendering for Admin */}
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
