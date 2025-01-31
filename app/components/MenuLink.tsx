import Link from "next/link"

type MenuLinkProps = {
  label: string
  link: string
  isHighlighted?: boolean
}

export default function MenuLink({
  label,
  link,
  isHighlighted,
}: MenuLinkProps) {
  return (
    <Link
      href={link}
      className={`menu__link ${isHighlighted ? "menu__link--highlighted" : ""}`}
    >
      {label}
    </Link>
  )
}
