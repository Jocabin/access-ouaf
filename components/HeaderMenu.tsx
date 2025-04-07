import { getAllCategories } from "@/services/categories.service"
import MenuLink from "./MenuLink"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { slugify } from "@/utils/helpers/slugify"

export default async function HeaderMenu() {
  const categories = await getAllCategories()

  const categoriesList = categories.slice(0, 10)

  return (
    <>
      <nav className="header__menu">
        {categoriesList.map((category) => (
          <MenuLink
            label={capitalizeFirstLetter(category.name)}
            key={category.name}
            link={`/categories/${slugify(category.name)}`}
          />
        ))}
      </nav>
    </>
  )
}
