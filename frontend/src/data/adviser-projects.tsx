// src/data/mock-projects.ts

// Define a type for a single project object for better code quality
export interface Project {
  id: number;
  leaderName: string;
  course: string;
  projectTitle: string;
}

// Define the array with the new Project type
const mockProjects: Project[] = [
  {
    id: 1,
    leaderName: "PJ's Name",
    course: "BSIS 3B",
    projectTitle: "PROJECT CAPSTONOVA: Enhancing Capstone Archiving and Optimizing Data Intelligence",
  },
  {
    id: 2,
    leaderName: "Angela Santos",
    course: "BSIS 3B",
    projectTitle: "E-Commerce Platform for Local Cebuano Artisans",
  },
  {
    id: 3,
    leaderName: "John Michael Reyes",
    course: "BSIT 4A",
    projectTitle: "Mobile Health Monitoring System using Wearable Sensors",
  },
  {
    id: 4,
    leaderName: "Jessica Garcia",
    course: "BSCS 4A",
    projectTitle: "AI-Powered Chatbot for University Admission Inquiries",
  },
  {
    id: 5,
    leaderName: "David Lim",
    course: "BSIT 4B",
    projectTitle: "Smart Home Automation via a Centralized Web Application",
  },
  {
    id: 6,
    leaderName: "Maria Cruz",
    course: "BSIS 3A",
    projectTitle: "Augmented Reality App for Local Historical Landmarks in Cebu",
  },
  {
    id: 7,
    leaderName: "Daniel Ramos",
    course: "BSCS 4B",
    projectTitle: "Blockchain-Based Voting System for University Student Council Elections",
  },
  {
    id: 8,
    leaderName: "Sophia Lee",
    course: "BSIT 3B",
    projectTitle: "Online Reservation and Management System for Campus Facilities",
  },
  {
    id: 9,
    leaderName: "James Gonzales",
    course: "BSIS 4A",
    projectTitle: "Gamified Learning Platform for Elementary Mathematics",
  },
  {
    id: 10,
    leaderName: "Olivia Torres",
    course: "BSCpE 5A",
    projectTitle: "IoT-Based Smart Irrigation and Environmental Monitoring System",
  },
  {
    id: 11,
    leaderName: "William Fernandez",
    course: "BSCS 4A",
    projectTitle: "Facial Recognition Attendance System for University Classrooms",
  },
  {
    id: 12,
    leaderName: "Ava Villanueva",
    course: "BSIT 4A",
    projectTitle: "Sentiment Analysis of Social Media for Local Brand Management",
  },
  {
    id: 13,
    leaderName: "Alexander Ocampo",
    course: "BSIS 4B",
    projectTitle: "Web-Based Inventory and Sales Management for Small Businesses",
  },
  {
    id: 14,
    leaderName: "Mia Mendoza",
    course: "BSIT 3A",
    projectTitle: "Disaster Response and Management Mobile Application with Real-time Alerts",
  },
  {
    id: 15,
    leaderName: "Ethan David",
    course: "BSCS 4B",
    projectTitle: "Machine Learning Model for Early Detection of Crop Diseases in the Philippines",
  },
  {
    id: 16,
    leaderName: "Isabella Castillo",
    course: "BSIS 3B",
    projectTitle: "Secure File Sharing and Digital Archiving System for Academic Departments",
  },
  {
    id: 17,
    leaderName: "Michael De Leon",
    course: "BSIT 4B",
    projectTitle: "Automated School Canteen Ordering System with Cashless Payments",
  },
  {
    id: 18,
    leaderName: "Emily Flores",
    course: "BSCS 4A",
    projectTitle: "3D Virtual Tour of the University Campus using WebGL",
  },
  {
    id: 19,
    leaderName: "Jacob Santos",
    course: "BSCpE 5B",
    projectTitle: "Low-Cost Braille Embosser for Visually Impaired Students",
  },
  {
    id: 20,
    leaderName: "Madison Garcia",
    course: "BSIS 4A",
    projectTitle: "Alumni Tracking and Information System with Job Portal",
  },
];

// Export the array as the default export from this file
export default mockProjects;