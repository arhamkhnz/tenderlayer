import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { PageBody, PageHeader } from "../-components/screen";

export function OrganizationSettingsScreen() {
  return (
    <PageBody className="max-w-4xl">
      <PageHeader
        title="Organization"
        description="Company identity and contact details used across contracts and invoices."
      />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Organization profile</CardTitle>
          <CardDescription>Legal and operational information for TenderLayer Services Private Limited.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="org-name">Legal name</FieldLabel>
                <Input id="org-name" defaultValue="TenderLayer Services Private Limited" />
              </Field>
              <Field>
                <FieldLabel htmlFor="org-short-name">Display name</FieldLabel>
                <Input id="org-short-name" defaultValue="TenderLayer Services" />
              </Field>
              <Field>
                <FieldLabel htmlFor="org-registration">Company registration number</FieldLabel>
                <Input id="org-registration" defaultValue="U74999DL2024PTC482910" />
              </Field>
              <Field>
                <FieldLabel htmlFor="org-email">Primary email</FieldLabel>
                <Input id="org-email" type="email" defaultValue="operations@tenderlayer.in" />
              </Field>
              <Field>
                <FieldLabel htmlFor="org-phone">Phone number</FieldLabel>
                <Input id="org-phone" defaultValue="+91 11 4182 6400" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="org-address">Registered address</FieldLabel>
                <Textarea
                  id="org-address"
                  defaultValue="214, Okhla Industrial Estate, Phase III, New Delhi, Delhi 110020"
                />
              </Field>
              <Field>
                <FieldLabel>Default currency</FieldLabel>
                <Select defaultValue="inr">
                  <SelectTrigger className="w-full" aria-label="Default currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="inr">INR — Indian Rupee</SelectItem>
                      <SelectItem value="usd">USD — US Dollar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Financial year starts</FieldLabel>
                <Select defaultValue="april">
                  <SelectTrigger className="w-full" aria-label="Financial year start">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="january">January</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Authorized signatory</CardTitle>
          <CardDescription>Default signatory shown on invoices and contract correspondence.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="signatory-name">Name</FieldLabel>
                <Input id="signatory-name" defaultValue="Arham Khan" />
              </Field>
              <Field>
                <FieldLabel htmlFor="signatory-title">Designation</FieldLabel>
                <Input id="signatory-title" defaultValue="Director" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="button">Save changes</Button>
      </div>
    </PageBody>
  );
}

export function TaxSettingsScreen() {
  return (
    <PageBody className="max-w-4xl">
      <PageHeader
        title="Tax settings"
        description="GST registration and default tax treatment for invoices and payroll records."
      />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>GST registration</CardTitle>
          <CardDescription>Registration information displayed on tax invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="gstin">GSTIN</FieldLabel>
                <Input id="gstin" defaultValue="07AABCT4829Q1Z6" />
                <FieldDescription>15-character Goods and Services Tax Identification Number.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="pan">PAN</FieldLabel>
                <Input id="pan" defaultValue="AABCT4829Q" />
              </Field>
              <Field>
                <FieldLabel>State of registration</FieldLabel>
                <Select defaultValue="delhi">
                  <SelectTrigger className="w-full" aria-label="State of registration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="state-code">State code</FieldLabel>
                <Input id="state-code" defaultValue="07" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Invoice defaults</CardTitle>
          <CardDescription>Default tax rate and invoice classification for new billing records.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Default GST rate</FieldLabel>
                <Select defaultValue="18">
                  <SelectTrigger className="w-full" aria-label="Default GST rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <Field>
                <FieldLabel htmlFor="sac-code">Default SAC code</FieldLabel>
                <Input id="sac-code" defaultValue="998599" />
              </Field>
              <Field>
                <FieldLabel>Place of supply</FieldLabel>
                <Select defaultValue="contract">
                  <SelectTrigger className="w-full" aria-label="Place of supply">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="contract">Use contract location</SelectItem>
                      <SelectItem value="organization">Use organization state</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Tax calculation</FieldLabel>
                <Select defaultValue="exclusive">
                  <SelectTrigger className="w-full" aria-label="Tax calculation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="exclusive">Tax exclusive</SelectItem>
                      <SelectItem value="inclusive">Tax inclusive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Payroll statutory references</CardTitle>
          <CardDescription>Organization registrations used for payroll reporting.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="epfo-number">EPFO establishment ID</FieldLabel>
                <Input id="epfo-number" defaultValue="DLCPM1234567000" />
              </Field>
              <Field>
                <FieldLabel htmlFor="esic-number">ESIC employer code</FieldLabel>
                <Input id="esic-number" defaultValue="11001234560001099" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="button">Save tax settings</Button>
      </div>
    </PageBody>
  );
}
