import { useState, useRef } from 'react'
import validator from 'validator'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { translations } from '../translations'

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const validData = {
                email: validator.normalizeEmail(formData.email, { gmail_remove_dots: false }),
                password: formData.password,
            }

            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validData),
            })

            const data = await response.json()

            if (response.ok) {
                onSuccess()
                toast.current?.show({
                    severity: 'success',
                    summary: translations.register.successSummary,
                    detail: data.message || translations.register.successMessage,
                })
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: translations.register.errorSummary,
                    detail: data.error || translations.register.errorMessage,
                })
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: translations.register.errorSummary,
                detail: translations.register.networkError,
            })
            console.error('Erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">{translations.login.email}</label>
                        <InputText
                            type="email"
                            id="email"
                            name="email"
                            className="p-inputtext-sm"
                            placeholder={translations.login.placeholder}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">{translations.login.password}</label>
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
                    <Button type="submit" className="flex justify-center mt-4" loading={loading}>
                        {translations.login.loginButton}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm