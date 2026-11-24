import type { Ref } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@tenderlayer/ui/components/combobox";
import { Input } from "@tenderlayer/ui/components/input";

// State and Union Territory names from the National Portal of India directory.
export const indianStatesAndUTs = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function StatePicker({
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
  describedBy,
  readOnly = false,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  invalid?: boolean;
  describedBy?: string;
  readOnly?: boolean;
}) {
  if (readOnly) {
    return (
      <Input
        id={id}
        name={name}
        ref={inputRef}
        value={value}
        onBlur={onBlur}
        readOnly
        placeholder="Select a contract first"
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
    );
  }
  return (
    <Combobox
      name={name}
      items={indianStatesAndUTs}
      value={value || null}
      onValueChange={(next) => onChange(next ?? "")}
    >
      <ComboboxInput
        id={id}
        ref={inputRef}
        onBlur={onBlur}
        className="w-full"
        placeholder="Select state / UT"
        showClear
        aria-invalid={invalid}
        aria-describedby={describedBy}
        autoComplete="address-level1"
      />
      <ComboboxContent className="w-84 max-w-(--available-width)">
        <ComboboxEmpty>No state or UT found.</ComboboxEmpty>
        <ComboboxList>
          {(state: string) => (
            <ComboboxItem key={state} value={state}>
              {state}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
