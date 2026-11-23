import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';
import { site } from '../config/site';

export default function Terms() {
  return (
    <LegalPage
      title="Terms and Conditions"
      summary="The terms that apply when you use the PYMLABS TECHNOLOGY website."
      updated="23 November 2026"
    >
      <p>
        These terms apply to your use of the PYMLABS TECHNOLOGY website (&ldquo;the website&rdquo;). By using the
        website, you agree to them. If you do not agree, please do not use the website.
      </p>

      <h2>About the website</h2>
      <p>
        The website provides general information about PYMLABS TECHNOLOGY and the services we offer. Nothing on the
        website is an offer to provide services on particular terms. Any project is governed by a separate written
        proposal or agreement setting out its scope, timeline, price and conditions.
      </p>

      <h2>Accuracy of information</h2>
      <p>
        We try to keep the information on the website accurate and current, but we do not guarantee that it is complete
        or free of errors, and it may change without notice. Descriptions of services and example interfaces illustrate
        the kind of work we do; they do not describe the results of any specific project.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The text, design, graphics and code of the website belong to PYMLABS TECHNOLOGY unless stated otherwise. Any third-party
        material is used under its own licence. You may view and print
        pages for your own reference, but you may not copy, republish or sell the content without our written
        permission.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the website in a way that breaks the law or harms others.</li>
        <li>Do not attempt to gain unauthorised access to the website or its hosting.</li>
        <li>Do not send spam, malicious code or automated requests through the website or its forms.</li>
      </ul>

      <h2>Enquiries</h2>
      <p>
        Sending an enquiry does not create a contract or oblige either party to work together. Please do not include
        passwords or other confidential information in an enquiry.
      </p>

      <h2>Links to other websites</h2>
      <p>
        Links to other websites are provided for convenience. We do not control and are not responsible for their content.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The website is provided &ldquo;as is&rdquo;. To the extent permitted by law, PYMLABS TECHNOLOGY is not liable for
        any loss or damage arising from your use of, or reliance on, the website.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top of this page shows the latest version.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>. See also our{' '}
        <Link to="/privacy-policy/">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
