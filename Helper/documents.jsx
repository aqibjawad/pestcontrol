// Helper function to get documents based on profession
export const getDocumentsByProfession = (profession) => {
  const allDocuments = [
    "Employment Letter",
    "Job Offer Letter/Joining Letter APCS",
    "Passport",
    "EID",
    "DM Card",
    "MOHRE Letter",
    "Labour Card",
    "Change Status",
    "Visa",
    "EHOC",
    "Medical Report",
    "Visa Stamping",
    "Health Insurance",
    "Vehicle Policy",
    "ILOE Insurance",
    "Bank Detail/Salary Transfer",
  ];

  // Documents to exclude for HR Manager
  const hrExcludedDocs = ["Vehicle Policy", "DM Card", "EHOC"];

  // Handle HR Manager case
  if (profession === "HR Manager") {
    return allDocuments.filter((doc) => !hrExcludedDocs.includes(doc));
  }

  // Handle Sales roles
  if (profession === "Sales Manager" || profession === "Sales Officer") {
    const salesExcludedDocs = ["DM Card", "EHOC"];
    return allDocuments.filter((doc) => !salesExcludedDocs.includes(doc));
  }

  // For other professions, return all documents
  return allDocuments;
};
