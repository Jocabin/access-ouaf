import Link from "next/link"
import { translations } from "../lib/translations"

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer__link">{translations.footer.privacyPolicy}</Link>
      <Link href="/" className="footer__link">{translations.footer.termsAndConditions}</Link>
      <Link href="/" className="footer__link">{translations.footer.aboutUs}</Link>
      <Link href="/" className="footer__link">{translations.footer.contactUs}</Link>
    </footer>
  )
}
