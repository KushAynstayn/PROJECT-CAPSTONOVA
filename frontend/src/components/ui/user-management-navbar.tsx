import React from "react";

// ✅ Added "Super Admin" as a valid role
export type Role =
  | "Viewer"
  | "Proponents"
  | "Advisers"
  | "Admin"
  | "Super Admin"
  | "Restricted";

interface NavigationBarProps {
  /** The currently active role */
  activeRole: Role;
  /** Function to call when a new role is selected */
  onSelectRole: (role: Role) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeRole,
  onSelectRole,
}) => {
  // ✅ Added Super Admin to the list of roles
  const roles: Role[] = [
    "Viewer",
    "Proponents",
    "Advisers",
    "Admin",
    "Super Admin",
    "Restricted",
  ];

  const navStyles: React.CSSProperties = {
    padding: "12px 20px",
    fontFamily: "sans-serif",
  };

  const listStyles: React.CSSProperties = {
    display: "flex",
    gap: "10px", // Spacing between tabs
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const getButtonStyles = (role: Role): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontSize: "16px",
    minWidth: "110px",
    textAlign: "center",
    color: activeRole === role ? "#3b82f6" : "#6b7280",
    fontWeight: activeRole === role ? "bold" : "normal",
    borderBottom: activeRole === role ? "2px solid #3b82f6" : "none",
    transition: "color 0.2s ease-in-out, border-bottom 0.2s ease-in-out",
  });

  return (
    <nav style={navStyles}>
      <ul style={listStyles}>
        {roles.map((role) => (
          <li key={role}>
            <button
              style={getButtonStyles(role)}
              onClick={() => onSelectRole(role)}
            >
              {role}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
