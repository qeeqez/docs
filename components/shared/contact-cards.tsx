import { Cards, Card } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import { CompanyInfo } from './company-info';

/**
 * contact cards
 */
export function LegalContactCards() {
  return (
    <Cards>
      <Card title="Legal Questions" description="For terms and legal inquiries">
        <p><strong>Email</strong>: legal@rixl.com</p>
        <p><strong>Response Time</strong>: Within 2-3 business days</p>
        <p>For questions about these Terms of Service, licensing, or legal matters.</p>
      </Card>

      <Card title="General Support" description="For account and service help">
        <p><strong>Support</strong>: Available through your account dashboard</p>
        <p><strong>Email</strong>: support@rixl.com</p>
        <p><strong>Response Time</strong>: Within 24 hours</p>
        <p>For technical support, billing questions, and general assistance.</p>
      </Card>

      <CompanyInfo />
    </Cards>
  );
}

/**
 * Privacy cards
 */
export function PrivacyContactCards() {
  return (
    <Cards>
      <Card title="General Privacy Questions" description="For privacy-related inquiries">
        <p><strong>Email</strong>: privacy@rixl.com</p>
        <p><strong>Support</strong>: Available through your account dashboard</p>
      </Card>

      <Card title="EU Data Protection Officer" description="For EU residents">
        <p><strong>Email</strong>: dpo@rixl.com</p>
        <p>For EU residents, you may also contact our Data Protection Officer for specific GDPR-related questions.</p>
      </Card>

      <CompanyInfo />
    </Cards>
  );
}

/**
 * Cookie policy cards
 */
export function CookieContactCards() {
  return (
    <Cards>
      <Card title="Privacy Questions" description="For cookie and privacy inquiries">
        <p><strong>Email</strong>: privacy@rixl.com</p>
        <p><strong>Response Time</strong>: Within 2-3 business days</p>
        <p>For questions about our cookie practices, privacy policy, and data protection.</p>
      </Card>

      <Card title="General Support" description="For account and technical support">
        <p><strong>Support</strong>: Available through your account dashboard</p>
        <p><strong>Email</strong>: support@rixl.com</p>
        <p><strong>Response Time</strong>: Within 24 hours</p>
        <p>For general support, account assistance, and cookie preference help.</p>
      </Card>

      <Card title="EU Data Protection Officer" description="For EU residents">
        <p><strong>Email</strong>: dpo@rixl.com</p>
        <p><strong>Response Time</strong>: Within 3-5 business days</p>
        <p>For EU residents with specific GDPR-related questions about cookies and data processing.</p>
        <Callout type="info">
          EU residents have additional rights under GDPR regarding cookie consent and data processing.
        </Callout>
      </Card>

      <CompanyInfo />
    </Cards>
  );
}

/**
 * Acceptable cards
 */
export function AcceptableUseContactCards() {
  return (
    <Cards>
      <Card title="Report Violations" description="Report policy violations">
        <p><strong>Email</strong>: abuse@rixl.com</p>
        <p><strong>Response Time</strong>: Within 24-48 hours</p>
        <p>For reporting violations of this Acceptable Use Policy, including inappropriate content or platform abuse.</p>
      </Card>

      <Card title="Legal Questions" description="Policy and legal inquiries">
        <p><strong>Email</strong>: legal@rixl.com</p>
        <p><strong>Response Time</strong>: Within 2-3 business days</p>
        <p>For questions about this policy, legal compliance, or terms clarification.</p>
      </Card>

      <Card title="General Support" description="Account and technical support">
        <p><strong>Support</strong>: Available through your account dashboard</p>
        <p><strong>Email</strong>: support@rixl.com</p>
        <p><strong>Response Time</strong>: Within 24 hours</p>
        <p>For general account support, technical assistance, and policy guidance.</p>
      </Card>
    </Cards>
  );
}
