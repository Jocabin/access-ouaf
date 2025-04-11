'use client'
import React, {useRef, useState} from 'react'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { translations } from '../translations'

interface UserAccountProps {
    id: string,
    name: string
    email: string,
    phone: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
}

export function UserAccount({ id, name, email, phone, address, postal_code, city, country }: UserAccountProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({ id, name, email, phone, address, postal_code, city, country })
    const [initialData, setInitialData] = useState({ id, name, email, phone, address, postal_code, city, country })
    const hasChanges = JSON.stringify(userData) !== JSON.stringify(initialData)
    const toast = useRef<Toast | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const toggleEdit = () => {
        if (isEditing) setUserData(initialData)
        setIsEditing(!isEditing)
    }

    const updateUser = async () => {
        setLoading(true)
        try {
            const responseUser = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
    
            const resultUser = await responseUser.json()

            const responseAddress = await fetch('/api/address/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const resultAddress = await responseAddress.json()
    
            if (responseUser.ok && responseAddress.ok) {
                const updatedData = {
                    name: resultUser.data.user.user_metadata.display_name,
                    email: resultUser.data.user.user_metadata.email,
                    // phone: resultUser.data.user.phone,
                    address: resultAddress.data[0].address,
                    postal_code: resultAddress.data[0].postal_code,
                    city: resultAddress.data[0].city,
                    country: resultAddress.data[0].country
                }
                setUserData((prev) => ({ ...prev, ...updatedData }))
                setInitialData((prev) => ({ ...prev, ...updatedData }))
                toast.current?.show({
                    severity: "success",
                    summary: translations.dashboard.accountPage.userAccountComponent.successSummary,
                    detail: translations.dashboard.accountPage.userAccountComponent.successContent,
                })
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: translations.dashboard.accountPage.userAccountComponent.errorSummary,
                    detail: translations.dashboard.accountPage.userAccountComponent.errorContent,
                })
                console.error('Erreur de mise à jour:', resultUser.error)
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: translations.dashboard.accountPage.userAccountComponent.errorSummary,
                detail: translations.dashboard.accountPage.userAccountComponent.errorContent,
            })
            console.error('Erreur lors de la mise à jour:', err)
        }
        setIsEditing(false)
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
                        <label
                            htmlFor='name'>{translations.dashboard.accountPage.userAccountComponent.nameLabel}</label>
                        <InputText
                            id='name'
                            name='name'
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label
                            htmlFor='email'>{translations.dashboard.accountPage.userAccountComponent.emailLabel}</label>
                        <InputText
                            id='email'
                            name='email'
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label
                            htmlFor='phone'>{translations.dashboard.accountPage.userAccountComponent.phoneLabel}</label>
                        <div className="flex flex-row items-center gap-2">
                            <label>{translations.dashboard.accountPage.userAccountComponent.phonePrefix}</label>
                            <InputText
                                id='phone'
                                name='phone'
                                type='tel'
                                disabled
                                value={userData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label
                            htmlFor='phone'>{translations.dashboard.accountPage.userAccountComponent.addressLabel}</label>
                        <div className="flex flex-row items-center gap-2">
                            <InputText
                                id='address'
                                name='address'
                                value={userData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-2'>
                        <div className='p-field flex flex-col gap-2'>
                            <label
                                htmlFor='postal_code'>{translations.dashboard.accountPage.userAccountComponent.postalCodeLabel}</label>
                            <div className="flex flex-row items-center gap-2">
                                <InputText
                                    id='postal_code'
                                    name='postal_code'
                                    type='number'
                                    value={userData.postal_code}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className='p-field flex flex-col gap-2'>
                            <label
                                htmlFor='city'>{translations.dashboard.accountPage.userAccountComponent.cityLabel}</label>
                            <div className="flex flex-row items-center gap-2">
                                <InputText
                                    id='city'
                                    name='city'
                                    value={userData.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className='p-field flex flex-col gap-2'>
                            <label
                                htmlFor='country'>{translations.dashboard.accountPage.userAccountComponent.countryLabel}</label>
                            <div className="flex flex-row items-center gap-2">
                                <InputText
                                    id='country'
                                    name='country'
                                    value={userData.country}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        label={translations.dashboard.accountPage.userAccountComponent.saveButton}
                        className='p-button-primary mt-4'
                        loading={loading}
                        disabled={!hasChanges}
                        onClick={updateUser}
                    />
                </div>
            ) : (
                <>
                    <p>{translations.dashboard.accountPage.userAccountComponent.nameLabel}: {userData.name}</p>
                    <p>{translations.dashboard.accountPage.userAccountComponent.emailLabel}: {userData.email}</p>
                    <p>{translations.dashboard.accountPage.userAccountComponent.phoneLabel}: {translations.dashboard.accountPage.userAccountComponent.phonePrefix} {userData.phone}</p>
                    <p>{translations.dashboard.accountPage.userAccountComponent.addressLabel}: {userData.address}, {userData.postal_code} {userData.city}, {userData.country}</p>
                </>
            )}
        </Card>
    )
}

export default UserAccount