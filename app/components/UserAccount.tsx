'use client'
import React, {useRef, useState} from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { translations } from '../translations'

interface UserAccountProps {
    name: string
    email: string,
    phone: string
}

export function UserAccount({ name, email, phone }: UserAccountProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({ name, email, phone })
    const [initialData, setInitialData] = useState({ name, email, phone })
    const hasChanges = JSON.stringify(userData) !== JSON.stringify(initialData)
    const toast = useRef<Toast | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const toggleEdit = () => {
        setIsEditing(!isEditing)
        setUserData(initialData)
    }

    const updateUser = async () => {
        setLoading(true)
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
                setUserData((prev) => ({
                    ...prev,
                    name: result.data.user.user_metadata.display_name,
                    email: result.data.user.new_email,
                    phone: result.data.user.phone
                }))
                setInitialData((prev) => ({
                    ...prev,
                    name: result.data.user.user_metadata.display_name,
                    email: result.data.user.new_email,
                    phone: result.data.user.phone
                }))
                toast.current?.show({
                    severity: "success",
                    summary: translations.dashboard.accountPage.userAccountComponent.successSummary,
                    detail: translations.dashboard.accountPage.userAccountComponent.successContent,
                })
                toggleEdit()
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: translations.dashboard.accountPage.userAccountComponent.errorSummary,
                    detail: translations.dashboard.accountPage.userAccountComponent.errorContent,
                })
                console.error('Erreur de mise à jour:', result.error)
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: translations.dashboard.accountPage.userAccountComponent.errorSummary,
                detail: translations.dashboard.accountPage.userAccountComponent.errorContent,
            })
            console.error('Erreur lors de la mise à jour:', err)
        }
        setLoading(false)
    }

    return (
        <Card title={ translations.dashboard.accountPage.userAccountComponent.cardTitle } className='flex-1'>
            <Toast ref={ toast } />
            <div className='flex justify-end mb-2'>
                <Button
                    icon={isEditing ? 'pi pi-times' : 'pi pi-pencil'}
                    className='p-button-rounded p-button-text'
                    onClick={toggleEdit}
                />
            </div>
            {isEditing ? (
                <div className='p-fluid flex flex-col gap-4'>
                    <div className='p-field flex flex-col gap-2'>
                        <label htmlFor='name'>{ translations.dashboard.accountPage.userAccountComponent.nameLabel }</label>
                        <InputText
                            id='name'
                            name='name'
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label htmlFor='email'>{ translations.dashboard.accountPage.userAccountComponent.emailLabel }</label>
                        <InputText
                            id='email'
                            name='email'
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label htmlFor='phone'>{ translations.dashboard.accountPage.userAccountComponent.phoneLabel }</label>
                        <div className="flex flex-row items-center gap-2">
                            <label>+33</label>
                            <InputText
                                id='phone'
                                name='phone'
                                type='tel'
                                value={userData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        label={ translations.dashboard.accountPage.userAccountComponent.saveButton }
                        className='p-button-primary mt-4'
                        loading={loading}
                        disabled={!hasChanges}
                        onClick={updateUser}
                    />
                </div>
            ) : (
                <>
                    <p>{ translations.dashboard.accountPage.userAccountComponent.nameLabel }: {userData.name}</p>
                    <p>{ translations.dashboard.accountPage.userAccountComponent.emailLabel }: {userData.email}</p>
                    <p>{ translations.dashboard.accountPage.userAccountComponent.phoneLabel }: {userData.phone}</p>
                </>
            )}
        </Card>
    )
}

export default UserAccount