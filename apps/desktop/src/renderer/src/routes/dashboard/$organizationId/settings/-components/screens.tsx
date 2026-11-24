import { BanknoteIcon, Building, FileIcon, ReceiptIcon } from "@keyline-icons/react";
import { useLoaderData } from "@tanstack/react-router";

import { Button } from "@tenderlayer/ui/components/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@tenderlayer/ui/components/field";
import { Input } from "@tenderlayer/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tenderlayer/ui/components/select";
import { Textarea } from "@tenderlayer/ui/components/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tenderlayer/ui/components/tabs";

const organizationTypes = [
  { value: null, label: "Select organization type" },
  { value: "sole-proprietorship", label: "Sole proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llp", label: "LLP" },
  { value: "private-limited", label: "Private limited company" },
  { value: "public-limited", label: "Public limited company" },
  { value: "other", label: "Other" },
];

export function OrganizationSettingsScreen() {
  const { organization } = useLoaderData({ from: "/dashboard/$organizationId" });
  return (
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--header-height))] min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background"
      aria-labelledby="organization-settings-title"
    >
      <header className="flex shrink-0 flex-col gap-4 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 id="organization-settings-title" className="text-3xl tracking-tighter leading-none">
            Organization
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your company information, registrations, invoicing, and payroll settings.
          </p>
        </div>
      </header>
      <Tabs
        orientation="vertical"
        defaultValue="company"
        className="min-h-0 flex-1 flex-col gap-0 overflow-hidden border-t border-border/60 md:flex-row"
      >
        <aside className="shrink-0 border-b border-border/60 px-2 py-4 md:w-56 md:border-r md:border-b-0 md:pt-4.5">
          <TabsList variant="navigation" className="h-auto w-full items-stretch" aria-label="Organization settings">
            <TabsTrigger
              value="company"
              className="grid h-8 flex-none grid-cols-[1rem_minmax(0,1fr)] items-center justify-start gap-2 border-0 px-2 text-left"
            >
              <Building aria-hidden="true" />
              Company details
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              className="grid h-8 flex-none grid-cols-[1rem_minmax(0,1fr)] items-center justify-start gap-2 border-0 px-2 text-left"
            >
              <FileIcon aria-hidden="true" />
              Registrations
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="grid h-8 flex-none grid-cols-[1rem_minmax(0,1fr)] items-center justify-start gap-2 border-0 px-2 text-left"
            >
              <ReceiptIcon aria-hidden="true" />
              Invoicing
            </TabsTrigger>
            <TabsTrigger
              value="payroll"
              className="grid h-8 flex-none grid-cols-[1rem_minmax(0,1fr)] items-center justify-start gap-2 border-0 px-2 text-left"
            >
              <BanknoteIcon aria-hidden="true" />
              Payroll
            </TabsTrigger>
          </TabsList>
        </aside>
        <TabsContent value="company" keepMounted className="min-h-0 min-w-0 overflow-y-auto px-4 py-4.5">
          <div className="flex w-full flex-col">
            <section
              aria-label="Company details"
              className="flex min-w-0 flex-col gap-5 border-b border-border/60 py-6 first:pt-0 last-of-type:border-b-0"
            >
              <FieldGroup className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-name">
                    Organization name
                  </FieldLabel>
                  <Input id="org-name" defaultValue={organization.name} />
                  <FieldDescription>Your workspace name. A short name or abbreviation is fine.</FieldDescription>
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-legal-name">
                    Legal name
                  </FieldLabel>
                  <Input id="org-legal-name" placeholder="Enter the registered business name" />
                  <FieldDescription>The registered name used on contracts and invoices.</FieldDescription>
                </Field>
                <Field className="gap-1 sm:col-span-2">
                  <FieldLabel className="font-normal" htmlFor="org-type">
                    Organization type
                  </FieldLabel>
                  <Select items={organizationTypes} defaultValue="private-limited">
                    <SelectTrigger id="org-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {organizationTypes.map((option) => (
                          <SelectItem key={option.value ?? "placeholder"} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-email">
                    Primary email
                  </FieldLabel>
                  <Input id="org-email" type="email" defaultValue="operations@tenderlayer.in" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-phone">
                    Phone number
                  </FieldLabel>
                  <Input id="org-phone" defaultValue="+91 11 4182 6400" />
                </Field>
                <Field className="gap-1 sm:col-span-2">
                  <FieldLabel className="font-normal" htmlFor="org-address">
                    Registered address
                  </FieldLabel>
                  <Textarea
                    id="org-address"
                    defaultValue="214, Okhla Industrial Estate, Phase III, New Delhi, Delhi 110020"
                  />
                </Field>
              </FieldGroup>
            </section>
          </div>
        </TabsContent>
        <TabsContent value="registrations" keepMounted className="min-h-0 min-w-0 overflow-y-auto px-4 py-4.5">
          <div className="flex w-full flex-col">
            <section
              aria-label="Tax registrations"
              className="flex min-w-0 flex-col gap-5 border-b border-border/60 py-6 first:pt-0 last-of-type:border-b-0"
            >
              <FieldGroup className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="gstin">
                    GSTIN
                  </FieldLabel>
                  <Input id="gstin" defaultValue="07AABCT4829Q1Z6" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="pan">
                    PAN
                  </FieldLabel>
                  <Input id="pan" defaultValue="AABCT4829Q" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal">State of registration</FieldLabel>
                  <Select
                    items={[
                      { value: "delhi", label: "Delhi" },
                      { value: "maharashtra", label: "Maharashtra" },
                      { value: "uttar-pradesh", label: "Uttar Pradesh" },
                    ]}
                    defaultValue="delhi"
                  >
                    <SelectTrigger className="w-full" aria-label="State of registration">
                      <SelectValue className="font-450" />
                    </SelectTrigger>
                    <SelectContent className="font-450">
                      <SelectGroup>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="state-code">
                    State code
                  </FieldLabel>
                  <Input id="state-code" defaultValue="07" />
                </Field>
              </FieldGroup>
            </section>
          </div>
        </TabsContent>
        <TabsContent value="invoices" keepMounted className="min-h-0 min-w-0 overflow-y-auto px-4 py-4.5">
          <div className="flex w-full flex-col">
            <section
              aria-labelledby="organization-invoice-defaults"
              className="flex min-w-0 flex-col gap-5 border-b border-border/60 py-6 first:pt-0 last-of-type:border-b-0"
            >
              <h2 id="organization-invoice-defaults" className="text-base font-medium leading-none">
                Invoice defaults
              </h2>
              <FieldGroup className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-1">
                  <FieldLabel className="font-normal">Default GST rate</FieldLabel>
                  <Select
                    items={[
                      { value: "0", label: "0%" },
                      { value: "5", label: "5%" },
                      { value: "12", label: "12%" },
                      { value: "18", label: "18%" },
                      { value: "28", label: "28%" },
                    ]}
                    defaultValue="18"
                  >
                    <SelectTrigger className="w-full" aria-label="Default GST rate">
                      <SelectValue className="font-450" />
                    </SelectTrigger>
                    <SelectContent className="font-450">
                      <SelectGroup>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="sac-code">
                    Default SAC code
                  </FieldLabel>
                  <Input id="sac-code" defaultValue="998599" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal">Place of supply</FieldLabel>
                  <Select
                    items={[
                      { value: "contract", label: "Use contract location" },
                      { value: "organization", label: "Use organization state" },
                    ]}
                    defaultValue="contract"
                  >
                    <SelectTrigger className="w-full" aria-label="Place of supply">
                      <SelectValue className="font-450" />
                    </SelectTrigger>
                    <SelectContent className="font-450">
                      <SelectGroup>
                        <SelectItem value="contract">Use contract location</SelectItem>
                        <SelectItem value="organization">Use organization state</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal">Tax calculation</FieldLabel>
                  <Select
                    items={[
                      { value: "exclusive", label: "Tax exclusive" },
                      { value: "inclusive", label: "Tax inclusive" },
                    ]}
                    defaultValue="exclusive"
                  >
                    <SelectTrigger className="w-full" aria-label="Tax calculation">
                      <SelectValue className="font-450" />
                    </SelectTrigger>
                    <SelectContent className="font-450">
                      <SelectGroup>
                        <SelectItem value="exclusive">Tax exclusive</SelectItem>
                        <SelectItem value="inclusive">Tax inclusive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </section>
            <section
              aria-labelledby="organization-bank-details"
              className="flex min-w-0 flex-col gap-5 border-b border-border/60 py-6 first:pt-0 last-of-type:border-b-0"
            >
              <header className="flex flex-col gap-1">
                <h2 id="organization-bank-details" className="text-base font-medium leading-none">
                  Bank details
                </h2>
                <p className="text-sm text-muted-foreground">
                  Account details shown on invoices for receiving payments.
                </p>
              </header>
              <FieldGroup className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-account-holder">
                    Account holder name
                  </FieldLabel>
                  <Input id="org-account-holder" placeholder="Name as registered with the bank" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-bank-name">
                    Bank name
                  </FieldLabel>
                  <Input id="org-bank-name" placeholder="Enter bank name" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-account-number">
                    Account number
                  </FieldLabel>
                  <Input id="org-account-number" inputMode="numeric" placeholder="Enter account number" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="org-ifsc">
                    IFSC
                  </FieldLabel>
                  <Input
                    id="org-ifsc"
                    autoCapitalize="characters"
                    spellCheck={false}
                    maxLength={11}
                    placeholder="e.g. SBIN0001234"
                  />
                </Field>
              </FieldGroup>
            </section>
            <section
              aria-labelledby="authorized-signatory"
              className="flex min-w-0 flex-col gap-5 border-b border-border/60 py-6 first:pt-0 last-of-type:border-b-0"
            >
              <header className="flex flex-col gap-1">
                <h2 id="authorized-signatory" className="text-base font-medium leading-none">
                  Authorized signatory
                </h2>
                <p className="text-sm text-muted-foreground">Default name and designation shown on invoices.</p>
              </header>
              <FieldGroup className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="signatory-name">
                    Name
                  </FieldLabel>
                  <Input id="signatory-name" defaultValue="Arham Khan" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="signatory-title">
                    Designation
                  </FieldLabel>
                  <Input id="signatory-title" defaultValue="Director" />
                </Field>
              </FieldGroup>
            </section>
          </div>
        </TabsContent>
        <TabsContent value="payroll" keepMounted className="min-h-0 min-w-0 overflow-y-auto px-4 py-4.5">
          <div className="flex w-full flex-col">
            <section
              aria-label="Payroll statutory references"
              className="flex min-w-0 flex-col gap-5 border-b border-border/60 py-6 first:pt-0 last-of-type:border-b-0"
            >
              <FieldGroup className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="epfo-number">
                    EPFO establishment ID
                  </FieldLabel>
                  <Input id="epfo-number" defaultValue="DLCPM1234567000" />
                </Field>
                <Field className="gap-1">
                  <FieldLabel className="font-normal" htmlFor="esic-number">
                    ESIC employer code
                  </FieldLabel>
                  <Input id="esic-number" defaultValue="11001234560001099" />
                </Field>
              </FieldGroup>
            </section>
          </div>
        </TabsContent>
      </Tabs>
      <footer className="flex h-12.25 shrink-0 items-center justify-end border-t border-border/60 bg-background px-4">
        <Button type="button" size="sm">
          Save changes
        </Button>
      </footer>
    </section>
  );
}
