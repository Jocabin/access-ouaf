import { login } from "@/supabase"
import { translations } from "../translations"

export default async function LoginPage() {
  //   function handleSubmit(event) {
  //     const textInput = event.target.textInput.value
  //     const searchType = event.target.searchType.value
  //     const params = new URLSearchParams(searchParams)

  //     event.preventDefault()

  //     params.set("search", textInput)
  //     params.set("source", searchType)
  //     router.push(`?${params.toString()}`)
  //   }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      console.error("Email and password are required.")
      return
    }

    const response = await login(email, password)

    if (response.error) {
      console.error("Login failed:", response.error)
      // Display error message in the UI
    } else {
      console.log("Login successful:", response.user)
      // Redirect or update UI on successful login
    }
  }

  return (
    <>
      {/* <div className="narrow--container"> */}
      <h2>{translations.pages.loginPage.title}</h2>

      <form onSubmit={(event) => handleSubmit(event)}>
        <label htmlFor="">
          <h3>{translations.pages.loginPage.email}</h3>
        </label>
        <input
          type="text"
          name="email"
          placeholder={translations.pages.loginPage.placeholder}
          required
        />

        <label htmlFor="">
          <h3>{translations.pages.loginPage.password}</h3>
        </label>
        <input type="password" name="password" required />

        <button type="submit">{translations.button.login}</button>
      </form>
      {/* </div> */}
    </>
  )
}
