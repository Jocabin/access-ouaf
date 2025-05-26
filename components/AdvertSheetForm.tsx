import React, { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { createAd, updateAdvert } from '@/services/adverts.service'
import { Category } from '@/types'
import type { Advert } from '@/components/AdvertsDashboard'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputNumber } from 'primereact/inputnumber'
import {FileUpload, FileUploadHandlerEvent} from 'primereact/fileupload'
import { translations } from '@/lib/translations'
import {deleteAvatar, uploadAvatar} from "@/actions/user/updateUserData";

export interface advertData {
    advert?: Advert
    onSuccess: (updatedAdvert: Advert) => void
    categories: Category[]
}

interface DropdownOption {
    label: string
    value: string
}
const AdvertSheetForm = ({ advert, onSuccess, categories }: advertData) => {
    const supabase = createClient()
    const [formData, setFormData] = useState({
        name: advert?.name || '',
        description: advert?.description || '',
        price: advert?.price || 0,
        brand: advert?.brand ?? '',
        state: advert?.state || '',
        img: advert?.img || null,
        category: advert?.category || null
    })
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)

    const stateOptions = [
        { value: 'Neuf' },
        { value: 'Correct' },
        { value: 'Usé' }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleDropdownChange = (name: string, value: DropdownOption) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleNumberChange = (name: string, value: number | null) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                toast.current?.show({
                    severity: 'error',
                    summary: translations.register.errorSummary,
                    detail: translations.dashboard.animalPage.animalSheetForm.loginErrorMessage,
                })
                setLoading(false)
                return
            }

            const advertData = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                brand: formData.brand,
                state: formData.state,
                img: formData.img,
                category: formData.category,
            }

            let data, error
            if (advert?.id) {
                ({ data, error } = await updateAdvert(advert.id, advertData))
            } else {
                ({ data, error } = await createAd(advertData))
            }

            if (error) {
                throw error
            }

            if (data) {
                onSuccess(data)
                toast.current?.show({
                    severity: 'success',
                    summary: translations.register.successSummary,
                    detail: translations.dashboard.animalPage.animalSheetForm.successMessage,
                })
            }
        } catch (error: unknown) {
            toast.current?.show({
                severity: 'error',
                summary: translations.register.errorSummary,
                detail: error instanceof Error ? error.message : translations.dashboard.animalPage.animalSheetForm.errorMessage,
            })
            console.error('Erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    const onImagesUpload = async (event: FileUploadHandlerEvent) => {
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
        <div>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title">
                            Nom de l&apos;annonce
                        </label>
                        <InputText
                            id="title"
                            name="title"
                            className="p-inputtext-sm"
                            placeholder={translations.dashboard.advertsPage.advertSheetForm.placeholderTitle}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">
                            Description
                        </label>
                        <InputTextarea
                            id="description"
                            name="description"
                            rows={5}
                            placeholder={translations.dashboard.advertsPage.advertSheetForm.placeholderDescription}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-inputtext-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="category">
                                Catégorie
                            </label>
                            <Dropdown
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={(e) => handleDropdownChange('categories', e.value)}
                                options={categories}
                                optionLabel="name"
                                placeholder={translations.dashboard.advertsPage.advertSheetForm.placeholderCategory}
                                className="w-full p-inputtext-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="brand">
                                Marque
                            </label>
                            <InputText
                                type="text"
                                id="brand"
                                name="brand"
                                className="p-inputtext-sm"
                                placeholder={translations.dashboard.advertsPage.advertSheetForm.placeholderBrand}
                                value={formData.brand}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="state">
                                État
                            </label>
                            <Dropdown
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={(e) => handleDropdownChange('state', e.value)}
                                options={stateOptions}
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderName}
                                className="w-full p-inputtext-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="price">
                                Prix
                            </label>
                            <InputNumber
                                id="price"
                                name="price"
                                value={formData.price}
                                min={0}
                                onValueChange={(e) => handleNumberChange('price', e.value ?? null)}
                                className="w-full p-inputtext-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor="photos">
                            Ajouter des photos
                        </label>
                        <FileUpload
                            name="photos"
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
                            uploadHandler={onImagesUpload}
                            disabled={loading}
                        />
                    </div>

                    <Button type="submit" className="flex justify-center mt-4" loading={loading}>
                        { advert ? translations.dashboard.advertsPage.advertSheetForm.submitButtonEdit : translations.dashboard.advertsPage.advertSheetForm.submitButtonCreate }
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AdvertSheetForm
