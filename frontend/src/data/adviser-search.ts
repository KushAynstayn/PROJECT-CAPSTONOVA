export type Project = {
  title: string;
  proponents: string;
  adviser: string;
  date: string;
  abstract: string;
};

export const mockProjects: Project[] = [
  {
    title: "Point of Sale System",
    proponents: "Juan Dela Cruz, Maria Santos",
    adviser: "Prof. Reyes",
    date: "2023-01-15",
    abstract:
      "This system aims to automate sales transactions in small businesses, providing faster and more accurate billing, inventory tracking, and sales reporting.",
  },
  {
    title: "Library Management System",
    proponents: "Pedro Lopez, Ana Cruz",
    adviser: "Dr. Mendoza",
    date: "2023-02-10",
    abstract:
      "A digital solution for managing book lending, cataloging, and user registration in school libraries.",
  },
  {
    title: "Inventory Tracking Application",
    proponents: "Carlos Lim, Jenny Tan",
    adviser: "Engr. Dizon",
    date: "2023-03-01",
    abstract:
      "An application to monitor stock levels, automate reorder processes, and improve warehouse efficiency.",
  },
  // ... continue adding abstracts for your 20 projects
];
