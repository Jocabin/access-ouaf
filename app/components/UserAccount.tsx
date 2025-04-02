'use client'

import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

interface UserAccountProps {
    name: string
    email: string
}

export function UserAccount({ name, email }: UserAccountProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({ name, email })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing)
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
                    <Button
                        label='Enregistrer'
                        className='p-button-primary mt-4'
                        onClick={toggleEdit}
                    />
                </div>
            ) : (
                <>
                    <p>Nom: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                </>
            )}
        </Card>
    )
}

export default UserAccount