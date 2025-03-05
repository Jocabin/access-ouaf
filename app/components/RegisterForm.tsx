import { useState } from 'react'

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        display_name: '',
        phone: '',
        address: '',
        postal_code: '',
        country: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                await response.json()
            } else {
                console.error('Erreur lors de l\'inscription')
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="display_name">Nom / Prénom</label>
                <input
                    type="text"
                    id="display_name"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="address">Adresse</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="postal_code">Code postal</label>
                <input
                    type="number"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="country">Pays</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="phone">Téléphone</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">S'inscrire</button>
        </form>
    )
}

export default RegisterForm
