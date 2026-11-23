import { ButtonLink } from '../components/Button';
import PageHero from '../components/PageHero';

export default function NotFound() {
  return (
    <PageHero
      lines={['This page does', 'not exist.']}
      intro={<p>The link may be old or mistyped. Try the home page or one of the sections below.</p>}
    >
      <ButtonLink to="/" variant="light" arrow>
        Back to home
      </ButtonLink>
      <ButtonLink to="/services/" variant="ghost-light">
        Services
      </ButtonLink>
      <ButtonLink to="/contact/" variant="ghost-light">
        Contact
      </ButtonLink>
    </PageHero>
  );
}
