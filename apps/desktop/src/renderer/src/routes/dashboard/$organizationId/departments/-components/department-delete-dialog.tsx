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

import type { DepartmentRecord } from "@shared/contracts/departments";

interface DepartmentDeleteDialogProps {
  department: DepartmentRecord | undefined;
  onClose: () => void;
  onDelete: (departmentId: string) => Promise<boolean>;
}

export function DepartmentDeleteDialog({ department, onClose, onDelete }: DepartmentDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    if (!department || isDeleting) return;

    setIsDeleting(true);
    setError("");
    try {
      if (await onDelete(department.id)) {
        onClose();
      } else {
        setError("This department is no longer available in this organization.");
      }
    } catch {
      setError("Couldn’t delete the department. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={Boolean(department)}
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
          <AlertDialogTitle className="leading-snug">Delete department?</AlertDialogTitle>
          <AlertDialogDescription className="text-wrap wrap-anywhere md:text-wrap">
            Remove {department?.name} from this organization.
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
            {isDeleting ? "Deleting…" : "Delete department"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
