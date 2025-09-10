// Define the structure for a single author
export interface Author {
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
}

// Define the structure for a publication
export interface Publication {
  id: number;
  title: string;
  authors: Author[];
  abstract: string;
  // ACM Computing Classification System (CCS) concepts
  ccsConcepts: { [code: string]: string };
  keywords: string[];
  publicationDate: string; // ISO 8601 format: "YYYY-MM-DD"
  conference: string;
  doi: string; // Digital Object Identifier
  pageNumber: string;
  publisher: string;
}

// Array of mock data
export const mockPublications: Publication[] = [
  {
    id: 1,
    title: "The Performance of modern virtual machines",
    authors: [
      {
        firstName: "Ada",
        lastName: "Lovelace",
        affiliation: "University of Computing",
        email: "ada.l@uc.edu",
      },
      {
        firstName: "Charles",
        lastName: "Babbage",
        affiliation: "Institute of Technology",
        email: "c.babbage@it.edu",
      },
    ],
    abstract:
      "This paper explores the overhead and performance characteristics of leading virtual machine monitors. We evaluate their efficiency in resource management, including CPU scheduling and memory allocation, under various workloads. Our findings suggest significant improvements in modern hypervisors compared to their predecessors.",
    ccsConcepts: {
      "10010520.10010575.10010577": "Computer systems organization → Virtulization",
      "10011007.10011006.10011041": "Software and its engineering → System simulation",
    },
    keywords: ["virtualization", "performance", "hypervisor", "cloud computing"],
    publicationDate: "2024-10-22",
    conference: "Proceedings of the 2024 ACM Symposium on Cloud Computing (SoCC '24)",
    doi: "10.1145/1234567.1234589",
    pageNumber: "112-125",
    publisher: "ACM",
  },
  {
    id: 2,
    title: "Ethical Considerations in Large Language Model Training",
    authors: [
      {
        firstName: "Grace",
        lastName: "Hopper",
        affiliation: "Naval Research Laboratory",
        email: "g.hopper@nrl.gov",
      },
      {
        firstName: "Alan",
        lastName: "Turing",
        affiliation: "University of Manchester",
        email: "alan.t@manchester.ac.uk",
      },
    ],
    abstract:
      "The training of large language models (LLMs) requires vast amounts of data, often scraped from the public internet. This work examines the ethical implications, including data privacy, algorithmic bias, and environmental impact. We propose a framework for more responsible data sourcing and model training.",
    ccsConcepts: {
      "10003456.10003457.10003527": "Social and professional topics → Computing",
      "10010147.10010178.10010179": "Computing methodologies → Natural language processing",
    },
    keywords: ["AI ethics", "LLM", "data privacy", "algorithmic bias", "machine learning"],
    publicationDate: "2025-04-15",
    conference: "Proceedings of the 2025 AAAI/ACM Conference on AI, Ethics, and Society (AIES '25)",
    doi: "10.1145/2345678.3456789",
    pageNumber: "301-315",
    publisher: "ACM",
  },
];