export type PaymentDirection = "collect" | "pay";
export type PaymentStatus = "Overdue" | "Due today" | "Upcoming";

export type Payment = {
  id: string;
  name: string;
  direction: PaymentDirection;
  category: string;
  amount: number;
  dueDate: number;
  status: PaymentStatus;
};

export const paymentDirectionOptions = [
  { value: "collect", label: "To collect" },
  { value: "pay", label: "To pay" },
];

export const paymentStatusOptions = [
  { value: "all", label: "Any status" },
  { value: "Overdue", label: "Overdue" },
  { value: "Due today", label: "Due today" },
  { value: "Upcoming", label: "Upcoming" },
];

export const paymentDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
export const paymentMonthFormatter = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

const samples = [
  { id: "INV-018", name: "CCI", direction: "collect", category: "Invoice", amount: 180000, day: 7, monthOffset: -1 },
  {
    id: "INV-021",
    name: "Ministry of Defense",
    direction: "collect",
    category: "Invoice",
    amount: 150000,
    day: 18,
    monthOffset: -1,
  },
  { id: "INV-024", name: "Railway", direction: "collect", category: "Invoice", amount: 150000, day: 5, monthOffset: 0 },
  { id: "INV-027", name: "CCI", direction: "collect", category: "Invoice", amount: 120000, day: 12, monthOffset: 0 },
  {
    id: "INV-030",
    name: "Education",
    direction: "collect",
    category: "Invoice",
    amount: 80000,
    day: 20,
    monthOffset: 0,
  },
  {
    id: "INV-033",
    name: "Ministry of Defense",
    direction: "collect",
    category: "Invoice",
    amount: 100000,
    day: 23,
    monthOffset: 0,
  },
  {
    id: "INV-036",
    name: "Aviation & Defense",
    direction: "collect",
    category: "Invoice",
    amount: 60000,
    day: 26,
    monthOffset: 0,
  },
  { id: "INV-039", name: "DH", direction: "collect", category: "Invoice", amount: 40000, day: 28, monthOffset: 0 },
  {
    id: "PAY-041",
    name: "Staff salaries",
    direction: "pay",
    category: "Salaries",
    amount: 240000,
    day: 5,
    monthOffset: 0,
  },
  { id: "PAY-042", name: "PF contribution", direction: "pay", category: "PF", amount: 48000, day: 12, monthOffset: 0 },
  {
    id: "PAY-043",
    name: "ESIC contribution",
    direction: "pay",
    category: "ESIC",
    amount: 18000,
    day: 18,
    monthOffset: 0,
  },
  { id: "PAY-044", name: "GST payment", direction: "pay", category: "GST", amount: 84000, day: 22, monthOffset: 0 },
  {
    id: "PAY-045",
    name: "Equipment rental",
    direction: "pay",
    category: "Vendor bill",
    amount: 60000,
    day: 25,
    monthOffset: 0,
  },
  { id: "PAY-046", name: "Office rent", direction: "pay", category: "Rent", amount: 40000, day: 28, monthOffset: 0 },
] satisfies (Omit<Payment, "dueDate" | "status"> & { day: number; monthOffset: number })[];

export function getSamplePayments(today: Date): Payment[] {
  const selectedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return samples.map(({ day, monthOffset, ...payment }) => {
    const dueDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + monthOffset, day).getTime();
    return {
      ...payment,
      dueDate,
      status: dueDate < todayStart ? "Overdue" : dueDate === todayStart ? "Due today" : "Upcoming",
    };
  });
}
