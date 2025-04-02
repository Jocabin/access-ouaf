'use client'
import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

interface UserAccountProps {
    name: string
    email: string,
    phone: string
}

export function UserAccount({ name, email, phone }: UserAccountProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({ name, email, phone })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }

    const updateUser = async () => {
        try {
            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
    
            const result = await response.json()
    
            if (response.ok) {
                console.log('Informations mises à jour avec succès')
                setUserData((prev) => ({
                    ...prev,
                    name: result.data.user.user_metadata.display_name,
                    email: result.data.user.new_email,
                    phone: result.data.user.phone
                }))
                toggleEdit()
            } else {
                console.error('Erreur de mise à jour:', result.error)
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err)
        }
    }

    return (
        <Card title='Informations personnelles' className='flex-1'>
            <div className='flex justify-end mb-2'>
                <Button
                    icon={isEditing ? 'pi pi-check' : 'pi pi-pencil'}
                    className='p-button-rounded p-button-text'
                    onClick={toggleEdit}
                />
            </div>
            {isEditing ? (
                <div className='p-fluid flex flex-col gap-4'>
                    <div className='p-field flex flex-col gap-2'>
                        <label htmlFor='name'>Nom</label>
                        <InputText
                            id='name'
                            name='name'
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label htmlFor='email'>Email</label>
                        <InputText
                            id='email'
                            name='email'
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label htmlFor='phone'>Téléphone</label>
                        <InputText
                            id='phone'
                            name='phone'
                            value={userData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        label='Enregistrer'
                        className='p-button-primary mt-4'
                        onClick={updateUser}
                    />
                </div>
            ) : (
                <>
                    <p>Nom: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Téléphone: {userData.phone}</p>
                </>
            )}
        </Card>
    )
}

export default UserAccount