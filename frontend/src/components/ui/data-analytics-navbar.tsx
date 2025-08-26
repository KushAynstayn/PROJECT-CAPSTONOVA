import React from "react";

// 1. Define the specific roles for the analytics page
export type AnalyticsRole =
  | "Advisory Load"
  | "Project Type"
  | "Environment Trend"
  | "Project Tools Trend";

// 2. Define the props interface for this specific component
interface DataAnalyticsNavbarProps {
  /** The currently active role */
  activeRole: AnalyticsRole;
  /** Function to call when a new role is selected */
  onSelectRole: (role: AnalyticsRole) => void;
}

// 3. Create the new component with a unique name
const DataAnalyticsNavbar: React.FC<DataAnalyticsNavbarProps> = ({
  activeRole,
  onSelectRole,
}) => {
  // 4. Use the specific roles for the analytics navbar
  const roles: AnalyticsRole[] = [
    "Advisory Load",
    "Project Type",
    "Environment Trend",
    "Project Tools Trend",
  ];

  // --- Styling remains the same ---
  const navStyles: React.CSSProperties = {
    padding: "12px 20px",
    fontFamily: "sans-serif",
  };

  const listStyles: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const getButtonStyles = (role: AnalyticsRole): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: "0 4px 4px 4px",
    cursor: "pointer",
    fontSize: "16px",
    minWidth: "110px",
    textAlign: "center",
    color: activeRole === role ? "#3b82f6" : "#6b7280",
    fontWeight: activeRole === role ? "bold" : "normal",
    borderBottom:
      activeRole === role ? "2px solid #3b82f6" : "2px solid transparent",
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

// 5. Export the new component
export default DataAnalyticsNavbar;