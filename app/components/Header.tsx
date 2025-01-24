import { getAllProducts } from "@/supabase"
import Logo from "./Logo"

export default async function Header() {
  console.log(await getAllProducts())

  return (
    <>
      <header>
        <i className="header--burger-icon fa-solid fa-burger"></i>
        <Logo />
        <div className="header--icons">
          <i className="fa-regular fa-heart"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>
      </header>
    </>
  )
}
