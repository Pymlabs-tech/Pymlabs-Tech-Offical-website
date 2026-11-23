import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';
import { site } from '../config/site';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="How PYMLABS TECHNOLOGY collects, uses and protects information when you visit this website or contact us."
      updated="23 November 2026"
    >
      <p>
        This policy explains how PYMLABS TECHNOLOGY (&ldquo;PYMLABS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles
        information when you visit this website or contact us. We aim to collect as little personal information as
        possible.
      </p>

      <h2>Information we collect</h2>
      <h3>When you browse the website</h3>
      <p>
        This website does not use cookies for tracking, advertising or analytics, and it does not load third-party
        tracking scripts. Fonts and images are served from this website itself.
      </p>
      <p>
        Like most websites, the server that hosts this site may automatically record technical information such as your
        IP address, browser type, the pages requested and the time of the request. These logs are kept by our hosting
        provider for security and operational purposes. Our hosting provider may also use a short-lived cookie or browser
        check to protect the site from automated abuse.
      </p>
      <h3>When you contact us</h3>
      <p>
        If you email us or use the enquiry form, we receive the information you choose to give us, such as your name,
        email address, company name, the service you are interested in, your budget range and your project description.
      </p>
      <p>
        When you submit the enquiry form, its contents are sent through{' '}
        <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
          EmailJS
        </a>
        , an email delivery service, to our email inbox. Nothing is stored on this website itself. If the form cannot
        be sent, it offers to open your own email app instead, and you decide whether to send the message.
      </p>
      <p>
        If you message us on WhatsApp, the conversation is handled by WhatsApp under its own{' '}
        <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
          privacy policy
        </a>
        , and we see your name and phone number as WhatsApp shows them. This website only links to WhatsApp; it does
        not load any WhatsApp code.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To reply to your enquiry and discuss your project.</li>
        <li>To prepare proposals, agreements and invoices if we work together.</li>
        <li>To keep a record of our correspondence.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for unrelated marketing without your consent.</p>

      <h2>Sharing</h2>
      <p>
        We share information only with service providers we need to operate, such as our email, form-delivery (EmailJS) and hosting
        providers, or
        where the law requires it.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We keep enquiry correspondence for as long as needed to respond and, if we work together, for as long as required
        for the project and for legal, tax and accounting purposes.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, subject to any
        legal obligation to keep it. Write to{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Links to other websites</h2>
      <p>
        This website may link to other websites. We are not responsible for their content or privacy practices.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top of this page shows when it was last changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>. See also our{' '}
        <Link to="/terms-and-conditions/">Terms and Conditions</Link>.
      </p>
    </LegalPage>
  );
}
