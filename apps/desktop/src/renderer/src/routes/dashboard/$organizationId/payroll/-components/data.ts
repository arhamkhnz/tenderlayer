// Preview records until payroll runs are connected to storage.
export const payrollRuns = [
  {
    id: "PAY-AUG-2026",
    period: "August 2026",
    contracts: "6",
    employees: "38",
    gross: "₹14,82,000",
    deductions: "₹1,24,600",
    status: "Review",
  },
  {
    id: "PAY-JUL-2026",
    period: "July 2026",
    contracts: "6",
    employees: "38",
    gross: "₹14,65,000",
    deductions: "₹1,22,900",
    status: "Paid",
  },
  {
    id: "PAY-JUN-2026",
    period: "June 2026",
    contracts: "5",
    employees: "36",
    gross: "₹13,92,000",
    deductions: "₹1,17,300",
    status: "Paid",
  },
  {
    id: "PAY-MAY-2026",
    period: "May 2026",
    contracts: "5",
    employees: "35",
    gross: "₹13,48,000",
    deductions: "₹1,13,800",
    status: "Paid",
  },
];

export type PayrollRun = (typeof payrollRuns)[number];
