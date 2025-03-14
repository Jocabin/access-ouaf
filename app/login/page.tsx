"use client"

import { useState } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { useRef } from "react"
import { translations } from "../translations"

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const toast = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <div>
      <Toast ref={toast} />
      <form>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">{translations.pages.loginPage.email}</label>
            <InputText
              type="email"
              id="email"
              name="email"
              className="p-inputtext-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">
              {translations.pages.loginPage.password}
            </label>
            <InputText
              type="password"
              id="password"
              name="password"
              className="p-inputtext-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="flex justify-center mt-4"
            loading={loading}
          >
            {translations.button.login}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
