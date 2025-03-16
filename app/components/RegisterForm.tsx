import { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { translations } from '../translations'

const RegisterForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        display_name: '',
        phone: '',
        address: '',
        postal_code: '',
        country: '',
        city: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                onSuccess()
                toast.current.show({
                    severity: 'success',
                    summary: translations.register.successSummary,
                    detail: data.message || translations.register.successMessage,
                })
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: translations.register.errorSummary,
                    detail: data.error || translations.register.errorMessage,
                })
            }
        } catch (error) {
            toast.current.show({
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
                        <label htmlFor="display_name">{translations.register.displayName}</label>
                        <InputText
                            type="text"
                            id="display_name"
                            name="display_name"
                            className="p-inputtext-sm"
                            value={formData.display_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">{translations.register.email}</label>
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
                        <label htmlFor="password">{translations.register.password}</label>
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
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div className="flex flex-col gap-2 md:w-3/4">
                            <label htmlFor="address">{translations.register.address}</label>
                            <InputText
                                type="text"
                                id="address"
                                name="address"
                                className="p-inputtext-sm"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:w-1/4">
                            <label htmlFor="postal_code">{translations.register.postalCode}</label>
                            <InputText
                                type="number"
                                id="postal_code"
                                name="postal_code"
                                className="p-inputtext-sm"
                                value={formData.postal_code}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <div className="flex flex-col gap-2 md:w-1/3">
                            <label htmlFor="city">{translations.register.city}</label>
                            <InputText
                                type="text"
                                id="city"
                                name="city"
                                className="p-inputtext-sm"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:w-1/3">
                            <label htmlFor="country">{translations.register.country}</label>
                            <InputText
                                type="text"
                                id="country"
                                name="country"
                                className="p-inputtext-sm"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:w-1/3">
                            <label htmlFor="phone">{translations.register.phone}</label>
                            <InputText
                                type="text"
                                id="phone"
                                name="phone"
                                className="p-inputtext-sm"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="flex justify-center mt-4" loading={loading}>
                        {translations.register.registerButton}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm