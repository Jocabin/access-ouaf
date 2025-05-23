'use client'
import React, {useRef, useState} from 'react'
import { updateUserDataAction, uploadAvatar, deleteAvatar } from '@/actions/user/updateUserData'
import { updateAddress } from '@/services/addresses.service'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Avatar } from 'primereact/avatar'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { translations } from '@/lib/translations'

interface UserAccountProps {
    id: string,
    name: string
    email: string,
    phone: string,
    avatar: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
}

export function UserAccount({ id, name, email, phone, avatar, address, postal_code, city, country }: UserAccountProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({ id, name, email, phone, avatar, address, postal_code, city, country })
    const [initialData, setInitialData] = useState({ id, name, email, phone, avatar, address, postal_code, city, country })
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

    const update = async () => {
        setLoading(true)
        try {
            const responseUser = await updateUserDataAction(userData)
            const responseAddress = await updateAddress(userData)
    
            if (responseUser?.user && responseAddress?.[0]) {
                const updatedData = {
                    name: responseUser.user.user_metadata.display_name,
                    email: responseUser.user.user_metadata.email,
                    // phone: resultUser.data.user.phone,
                    address: responseAddress?.[0].address,
                    postal_code: responseAddress?.[0].postal_code,
                    city: responseAddress?.[0].city,
                    country: responseAddress?.[0].country
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
                console.error('Erreur de mise à jour:', responseUser)
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

    const onAvatarUpload = async (event: FileUploadHandlerEvent) => {
        setLoading(true)
        try {
            const file = event.files?.[0]
            if (!file) {
                setLoading(false)
                return
            }
            if (userData.avatar != null) {
                await deleteAvatar(userData.avatar)
            }
            const response = await uploadAvatar(file, userData.id)
            if (response) setUserData({ ...userData, avatar: response.path })
        } catch (err) {
            console.error(err)
            toast.current?.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Échec de l’upload de l’avatar'
            })
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
                            htmlFor='avatar'>{translations.dashboard.accountPage.userAccountComponent.avatar}
                        </label>
                        <FileUpload
                            name="avatar"
                            accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg"
                            multiple={false}
                            chooseLabel={translations.dashboard.accountPage.userAccountComponent.avatarChooseLabel}
                            uploadLabel={translations.dashboard.accountPage.userAccountComponent.avatarUploadLabel}
                            cancelLabel={translations.dashboard.accountPage.userAccountComponent.avatarCancelLabel}
                            emptyTemplate={<p className="m-0">{translations.dashboard.accountPage.userAccountComponent.avatarEmptyTemplate}</p>}
                            invalidFileSizeMessageSummary={translations.dashboard.accountPage.userAccountComponent.invalidFileSizeMessageSummary}
                            invalidFileSizeMessageDetail={translations.dashboard.accountPage.userAccountComponent.invalidFileSizeMessgage}
                            maxFileSize={5000000}
                            customUpload
                            uploadHandler={onAvatarUpload}
                            disabled={loading}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label
                            htmlFor='name'>{translations.dashboard.accountPage.userAccountComponent.nameLabel}
                        </label>
                        <InputText
                            id='name'
                            name='name'
                            value={userData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label
                            htmlFor='email'>{translations.dashboard.accountPage.userAccountComponent.emailLabel}
                        </label>
                        <InputText
                            id='email'
                            name='email'
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='p-field flex flex-col gap-2'>
                        <label
                            htmlFor='phone'>{translations.dashboard.accountPage.userAccountComponent.phoneLabel}
                        </label>
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
                            htmlFor='phone'>{translations.dashboard.accountPage.userAccountComponent.addressLabel}
                        </label>
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
                                htmlFor='postal_code'>{translations.dashboard.accountPage.userAccountComponent.postalCodeLabel}
                            </label>
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
                                htmlFor='city'>{translations.dashboard.accountPage.userAccountComponent.cityLabel}
                            </label>
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
                                htmlFor='country'>{translations.dashboard.accountPage.userAccountComponent.countryLabel}
                            </label>
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
                        onClick={update}
                    />
                </div>
            ) : (
                <>
                    <Avatar
                        className="avatar-fixed"
                        image={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_AVATAR_URL}${userData.avatar}` || undefined}
                        icon={!userData.avatar ? 'pi pi-user' : undefined}
                        size="xlarge"
                        shape="circle"
                        style={{ width: '64px', height: '64px', overflow: 'hidden' }}
                    />
                    <p>{translations.dashboard.accountPage.userAccountComponent.nameLabel}: {userData.name}</p>
                    <p>{translations.dashboard.accountPage.userAccountComponent.emailLabel}: {userData.email}</p>
                    <p>
                        {translations.dashboard.accountPage.userAccountComponent.phoneLabel}
                        : {userData.phone ? `${translations.dashboard.accountPage.userAccountComponent.phonePrefix} ${userData.phone}` : ''}
                    </p>
                    <p>{translations.dashboard.accountPage.userAccountComponent.addressLabel}
                        : {userData.address && `${userData.address}, `}
                        {userData.postal_code && `${userData.postal_code} `}
                        {userData.city && `${userData.city}, `}
                        {userData.country && `${userData.country}`}
                    </p>
                </>
            )}
        </Card>
    )
}

export default UserAccount