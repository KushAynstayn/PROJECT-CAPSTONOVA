// Define a type for our project structure for reusability
export type Project = {
    id: number;
    category: string;
    title: string;
    proponents: string;
    adviser: string;
    datePublished: string;
};

// --- Mock Data ---
// This data is now separated into its own file for better organization.
export const mockProjects: Project[] = [
  { id: 1, category: "education", title: "AI in Modern Education", proponents: "Alice Johnson, Bob Williams", adviser: "Dr. Emily Carter", datePublished: "2025-05-14" },
  { id: 2, category: "science", title: "Sustainable Agriculture Techniques", proponents: "Charlie Brown, Diana Miller", adviser: "Dr. Frank White", datePublished: "2025-04-22" },
  { id: 3, category: "business", title: "The Future of E-Commerce", proponents: "Eve Davis, George Harris", adviser: "Dr. Helen Clark", datePublished: "2025-03-01" },
  { id: 4, category: "education", title: "Gamified Learning Platforms", proponents: "Ivy Green, Jack Turner", adviser: "Dr. Emily Carter", datePublished: "2025-05-30" },
  { id: 5, category: "science", title: "Renewable Energy for Urban Areas", proponents: "Kate Lewis, Leo Hall", adviser: "Dr. Michael Scott", datePublished: "2025-02-19" },
  { id: 6, category: "health", title: "Mental Health and Technology", proponents: "Mia Adams, Noah King", adviser: "Dr. Olivia Martinez", datePublished: "2025-01-11" },
  { id: 7, category: "business", title: "Blockchain for Supply Chain Management", proponents: "Oscar Perry, Penny Quinn", adviser: "Dr. Robert Steele", datePublished: "2025-04-18" },
  { id: 8, category: "health", title: "Wearable Tech for Remote Patient Monitoring", proponents: "Quincy Roberts, Rachel Smith", adviser: "Dr. Susan Taylor", datePublished: "2025-03-25" },
  { id: 9, category: "science", title: "CRISPR Gene Editing in Plant Biology", proponents: "Steve Turner, Tina Underwood", adviser: "Dr. Frank White", datePublished: "2025-05-02" },
  { id: 10, category: "education", title: "Virtual Reality Labs for Chemistry", proponents: "Uma Vance, Victor Walker", adviser: "Dr. Emily Carter", datePublished: "2025-02-10" },
  { id: 11, category: "business", title: "AI-Powered Customer Service Chatbots", proponents: "Wendy Xiong, Xavier Young", adviser: "Dr. Helen Clark", datePublished: "2025-01-29" },
  { id: 12, category: "health", title: "Predictive Analytics for Disease Outbreaks", proponents: "Yara Zayne, Zack Adams", adviser: "Dr. Olivia Martinez", datePublished: "2025-04-05" },
  { id: 13, category: "science", title: "Ocean Cleanup Using Autonomous Drones", proponents: "Aaron Bell, Brenda Cook", adviser: "Dr. Michael Scott", datePublished: "2025-03-15" },
  { id: 14, category: "education", title: "Adaptive Testing Systems with Machine Learning", proponents: "Cathy Doyle, David Evans", adviser: "Dr. Emily Carter", datePublished: "2025-05-21" },
  { id: 15, category: "business", title: "FinTech Solutions for the Unbanked", proponents: "Fiona Green, Gary Hill", adviser: "Dr. Robert Steele", datePublished: "2025-02-28" },
  { id: 16, category: "health", title: "Genomic Data Privacy and Security", proponents: "Hannah Irwin, Ian Jones", adviser: "Dr. Susan Taylor", datePublished: "2025-01-07" },
  { id: 17, category: "science", title: "Next-Generation Battery Technology", proponents: "Jack Klein, Laura Moore", adviser: "Dr. Frank White", datePublished: "2025-04-11" },
  { id: 18, category: "education", title: "Peer-to-Peer Tutoring Network Platform", proponents: "Megan Nash, Owen Price", adviser: "Dr. Emily Carter", datePublished: "2025-03-08" },
  { id: 19, category: "business", title: "Hyper-Personalized Marketing Engines", proponents: "Paula Reed, Steve Taylor", adviser: "Dr. Helen Clark", datePublished: "2025-05-19" },
  { id: 20, category: "health", title: "3D Bioprinting of Human Tissues", proponents: "Roger Evans, Ursula Vance", adviser: "Dr. Olivia Martinez", datePublished: "2025-02-14" },
];
