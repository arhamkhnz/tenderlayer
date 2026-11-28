import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tenderlayer/ui/components/alert-dialog";
import { FieldError } from "@tenderlayer/ui/components/field";

import type { EmployeeRecord } from "@shared/contracts/employees";

interface EmployeeDeleteDialogProps {
  employee: EmployeeRecord | undefined;
  onClose: () => void;
  onDelete: (employeeId: string) => Promise<boolean>;
}

export function EmployeeDeleteDialog({ employee, onClose, onDelete }: EmployeeDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    if (!employee || isDeleting) return;

    setIsDeleting(true);
    setError("");
    try {
      if (await onDelete(employee.id)) {
        onClose();
      } else {
        setError("This employee is no longer available in this organization.");
      }
    } catch {
      setError("Couldn’t delete the employee. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={Boolean(employee)}
      onOpenChange={(open, eventDetails) => {
        if (open) return;
        if (isDeleting) {
          eventDetails.cancel();
          return;
        }
        setError("");
        onClose();
      }}
    >
      <AlertDialogContent className="w-[calc(100%-3rem)] bg-card text-card-foreground data-[size=default]:max-w-md data-[size=default]:sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-start gap-1 text-left">
          <AlertDialogTitle className="leading-snug">Delete employee?</AlertDialogTitle>
          <AlertDialogDescription className="text-wrap wrap-anywhere md:text-wrap">
            Remove {employee?.name} ({employee?.code}) from this organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <FieldError>{error}</FieldError>}
        <AlertDialogFooter className="mx-0 mb-0 border-0 bg-transparent p-0">
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void confirmDelete()}
          >
            {isDeleting ? "Deleting…" : "Delete employee"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
