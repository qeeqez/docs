import { Card } from 'fumadocs-ui/components/card';

/**
 * Reusable details
 * */
export function CompanyInfo() {
  return (
    <Card title="Company Information" description="Our business address">
      <p><strong>Company</strong>: RIXL Inc.</p>
      <p><strong>Address</strong>: 147 QUIGLEY BLVD, HISTORIC NEW CASTLE, DE 19720, USA</p>
      <p><strong>Business Hours</strong>: Monday - Friday, 9 AM - 6 PM PST</p>
      <p>For formal correspondence and legal notices.</p>
    </Card>
  );
}

/**
 * Company information
 */
export const COMPANY_NAME = "RIXL Inc.";
export const COMPANY_ADDRESS = "147 QUIGLEY BLVD, HISTORIC NEW CASTLE, DE 19720, USA";
export const BUSINESS_HOURS = "Monday - Friday, 9 AM - 6 PM PST";

/**
 * company address
 */
export function CompanyAddress() {
  return (
    <>
      <strong>{COMPANY_NAME}</strong><br />
      {COMPANY_ADDRESS}
    </>
  );
}
