import { translations } from "../translations"
import MenuLink from "./MenuLink"

export default function HeaderMenu() {
  return (
    <>
      <nav className="header__menu">
        <MenuLink label={translations.categories.dog} link="/" />
        <MenuLink label={translations.categories.cat} link="/" />
        <MenuLink label={translations.categories.bird} link="/" />
        <MenuLink label={translations.categories.rodent} link="/" />
        <MenuLink label={translations.categories.reptile} link="/" />
        <MenuLink label={translations.categories.horse} link="/" />
        <MenuLink label={translations.categories.clothing} link="/" />
        <MenuLink label={translations.categories.toys} link="/" />
        <MenuLink label={translations.categories.accessories} link="/" />
        <MenuLink label={translations.categories.food} link="/" />
        <MenuLink label={translations.categories.sales} link="/" isHighlighted={true}/>
      </nav>
    </>
  )
}
