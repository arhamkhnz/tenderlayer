export const purchaseCategories = ["Cleaning supplies", "Electronics", "Equipment", "Office supplies", "Other"];
export const paymentStatuses = ["Draft", "Unpaid", "Partially paid", "Paid"];

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);

// Preview records until purchases are connected to storage.
export const purchases = [
  {
    id: "PUR-001",
    invoice: "CS-2026-118",
    vendor: "CleanSource Supplies",
    description: "Floor cleaner and housekeeping materials",
    category: "Cleaning supplies",
    contract: "Railway signaling maintenance",
    date: "20 Nov 2026",
    amount: 12500,
    gst: 2250,
    status: "Paid",
  },
  {
    id: "PUR-002",
    invoice: "ET-2026-084",
    vendor: "Essential Tech",
    description: "Laptop for site operations",
    category: "Electronics",
    contract: "Regional IT support services",
    date: "18 Nov 2026",
    amount: 45000,
    gst: 8100,
    status: "Unpaid",
  },
  {
    id: "PUR-003",
    invoice: "FE-2026-056",
    vendor: "Facility Equipment Co.",
    description: "Commercial vacuum cleaner",
    category: "Equipment",
    contract: "Airport facility staffing",
    date: "15 Nov 2026",
    amount: 18000,
    gst: 3240,
    status: "Partially paid",
  },
  {
    id: "PUR-004",
    invoice: "OS-2026-203",
    vendor: "Office Essentials",
    description: "Stationery and printer paper",
    category: "Office supplies",
    contract: "",
    date: "12 Nov 2026",
    amount: 2500,
    gst: 450,
    status: "Paid",
  },
];
