import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";
import { TabsContent, TabsTrigger } from "@tenderlayer/ui/components/tabs";

import { ContractTableFooter } from "../../-components/table/contract-table-footer";

const sections = [
  {
    id: "employees",
    title: "Employees",
    columns: ["Employee", "Role", "Assignment"],
    emptyMessage: "Employee assignments aren’t available yet.",
  },
  {
    id: "invoices",
    title: "Invoices",
    columns: ["Invoice", "Amount", "Status"],
    emptyMessage: "Linked invoices aren’t available yet.",
  },
  {
    id: "purchases",
    title: "Purchases",
    columns: ["Purchase", "Amount", "Status"],
    emptyMessage: "Linked purchases aren’t available yet.",
  },
  {
    id: "payroll",
    title: "Payroll",
    columns: ["Pay period", "Amount", "Status"],
    emptyMessage: "Linked payroll runs aren’t available yet.",
  },
];

export function ContractRecordTabs() {
  return sections.map(({ id, title }) => (
    <TabsTrigger key={id} value={id}>
      {title}
    </TabsTrigger>
  ));
}

export function ContractRecordPanels() {
  return sections.map(({ id, title, columns, emptyMessage }) => (
    <TabsContent
      key={id}
      value={id}
      className="flex min-h-0 min-w-0 flex-col *:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:flex-1 *:data-[slot=table-container]:overflow-auto"
    >
      <Table
        aria-label={title}
        className="min-w-[32rem] table-fixed border-b border-border/60 [&_td]:border-r [&_td]:border-border/50 [&_td]:px-4.5 [&_td:last-child]:border-r-0"
      >
        <colgroup>
          <col />
          <col className="w-40 md:w-56" />
          <col className="w-36" />
        </colgroup>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column}
                className="h-10 border-r border-border/50 px-4.5 font-normal text-muted-foreground last:border-r-0"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <ContractTableFooter label={id === "payroll" ? "payroll runs" : id} rowCount={0} pageIndex={0} pageSize={10} />
    </TabsContent>
  ));
}
