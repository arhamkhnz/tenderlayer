// Preview records until invoices are connected to storage.
export const invoices = [
  {
    id: "INV-2026-042",
    invoice: "INV-2026-042",
    contract: "Railway signaling maintenance",
    issued: "21 Aug 2026",
    due: "10 Sep 2026",
    amount: "₹4,05,000",
    status: "Draft",
  },
  {
    id: "INV-2026-041",
    invoice: "INV-2026-041",
    contract: "Regional IT support services",
    issued: "05 Aug 2026",
    due: "20 Aug 2026",
    amount: "₹2,60,000",
    status: "Overdue",
  },
  {
    id: "INV-2026-040",
    invoice: "INV-2026-040",
    contract: "Municipal fleet maintenance",
    issued: "02 Aug 2026",
    due: "17 Aug 2026",
    amount: "₹1,56,250",
    status: "Sent",
  },
  {
    id: "INV-2026-039",
    invoice: "INV-2026-039",
    contract: "Railway signaling maintenance",
    issued: "22 Jul 2026",
    due: "10 Aug 2026",
    amount: "₹4,05,000",
    status: "Paid",
  },
  {
    id: "INV-2026-038",
    invoice: "INV-2026-038",
    contract: "Regional IT support services",
    issued: "05 Jul 2026",
    due: "20 Jul 2026",
    amount: "₹2,60,000",
    status: "Paid",
  },
];

export type Invoice = (typeof invoices)[number];
