import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

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
                toast.current.show({ severity: 'success', summary: 'Succès', detail: data.message || 'Inscription réussie' })
            } else {
                toast.current.show({ severity: 'error', summary: 'Erreur', detail: data.error || 'Erreur lors de l\'inscription' })
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'inscription' })
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
                        <label htmlFor="display_name">Nom / Prénom</label>
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
                        <label htmlFor="email">Email</label>
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
                        <label htmlFor="password">Mot de passe</label>
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
                            <label htmlFor="address">Adresse</label>
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
                            <label htmlFor="postal_code">Code postal</label>
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
                            <label htmlFor="city">Ville</label>
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
                            <label htmlFor="country">Pays</label>
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
                            <label htmlFor="phone">Téléphone</label>
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
                        S'inscrire
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm