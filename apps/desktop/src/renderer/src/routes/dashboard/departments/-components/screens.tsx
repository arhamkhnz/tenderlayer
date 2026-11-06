import { SearchIcon } from "@keyline-icons/react";
import { useState } from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@tenderlayer/ui/components/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tenderlayer/ui/components/table";

import { DataCard, PageHeader } from "../../-components/screen";

import { departments } from "./data";

export function DepartmentsScreen() {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visibleDepartments = departments.filter((department) =>
    `${department.name} ${department.code}`.toLowerCase().includes(query),
  );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Departments" description="Manage the departments in your organization." />
      <DataCard
        title="All departments"
        description={`${departments.length} departments in your organization.`}
        action={
          <InputGroup className="w-60">
            <InputGroupInput
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search departments…"
              aria-label="Search departments"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        }
        contentClassName="px-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.code}</TableCell>
              </TableRow>
            ))}
            {!visibleDepartments.length && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                  No departments match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataCard>
    </div>
  );
}
