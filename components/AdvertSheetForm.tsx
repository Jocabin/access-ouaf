import React, { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { createAd, deleteImages, updateAdvert, updateAdvertDataImg, uploadImages } from '@/services/adverts.service'
import { Category } from '@/types'
import type { Advert } from '@/components/AdvertsDashboard'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputNumber } from 'primereact/inputnumber'
import { FileUpload } from 'primereact/fileupload'
import { translations } from '@/lib/translations'

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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const toast = useRef<Toast>(null)

    const capitalizedCategories = categories.map((cat) => ({
        ...cat,
        name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
    }));

    const stateOptions = [
        { value: 'Neuf', label: 'Neuf' },
        { value: 'Correct', label: 'Correct' },
        { value: 'Usé', label: 'Usé' },
    ]

    useEffect(() => {
        const loadImages = async () => {
            if (advert?.img) {
                const files = await fetchExistingImages(advert.img)
                setSelectedFiles(files)
            }
        }
        loadImages()
    }, [advert])

    const fetchExistingImages = async (imgString: string): Promise<File[]> => {
        const imageNames = imgString.split(',').map(i => i.trim())
        const fetchedFiles: File[] = []

        for (const name of imageNames) {
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${name}`
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], name, { type: blob.type })
            fetchedFiles.push(file)
        }

        return fetchedFiles
    }

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

    const handleRemoveImage = async (imgName: string, advertId: string) => {
        setLoading(true)
        await deleteImages(imgName)
        const updatedImgList = formData.img?.split(',').filter(name => name.trim() !== imgName.trim()) ?? []
        await updateAdvertDataImg(updatedImgList.join(','), advertId)
        setFormData(prev => ({
            ...prev,
            img: updatedImgList.join(','),
        }))
        setSelectedFiles(prev => prev.filter(file => file.name !== imgName.trim()))
        setLoading(false)
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
                category: formData.category?.id ?? 0,
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
                const existingImageNames = formData.img?.split(',').map(name => name.trim()) ?? []
                let uploaded: string[] = []

                if (selectedFiles.length > 0) {
                    uploaded = await uploadSelectedImages(data.id)
                }

                const updatedAdvert = {
                    ...data,
                    category: formData.category,
                    img: [...existingImageNames, ...uploaded].join(','),
                }
                onSuccess(updatedAdvert)
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

    const uploadSelectedImages = async (advertId: string): Promise<string[]> => {
        const uploaded: string[] = []
        const existingImageNames = formData.img?.split(',').map(name => name.trim()) ?? []
        try {
            for (const file of selectedFiles) {
                if (existingImageNames.includes(file.name)) {
                    continue
                }
                const data = await uploadImages(file)
                if (data?.path) {
                    uploaded.push(data.path)
                }
            }
        } catch (err) {
            console.error('Erreur lors de l’upload des images :', err)
            toast.current?.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Échec de l’upload des images',
            })
        }
        if (uploaded.length > 0) {
            await updateAdvertDataImg([...existingImageNames, ...uploaded].join(','), advertId)
        }
        return uploaded
    }


    return (
        <div>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">
                            {translations.dashboard.advertsPage.advertSheetForm.titleLabel}
                        </label>
                        <InputText
                            id="name"
                            name="name"
                            className="p-inputtext-sm"
                            placeholder={translations.dashboard.advertsPage.advertSheetForm.placeholderTitle}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">
                            {translations.dashboard.advertsPage.advertSheetForm.descriptionLabel}
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
                                {translations.dashboard.advertsPage.advertSheetForm.categoryLabel}
                            </label>
                            <Dropdown
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        category: e.value
                                    }))
                                }}
                                options={capitalizedCategories}
                                optionLabel="name"
                                dataKey="id"
                                placeholder={translations.dashboard.advertsPage.advertSheetForm.placeholderCategory}
                                className="w-full p-inputtext-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="brand">
                                {translations.dashboard.advertsPage.advertSheetForm.brandLabel}
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
                                {translations.dashboard.advertsPage.advertSheetForm.stateLabel}
                            </label>
                            <Dropdown
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={(e) => handleDropdownChange('state', e.value)}
                                options={stateOptions}
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderName}
                                className="w-full p-inputtext-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="price">
                                {translations.dashboard.advertsPage.advertSheetForm.priceLabel}
                            </label>
                            <InputNumber
                                id="price"
                                name="price"
                                value={formData.price}
                                min={0}
                                onValueChange={(e) => handleNumberChange('price', e.value ?? null)}
                                className="w-full p-inputtext-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor="photos">
                            {translations.dashboard.advertsPage.advertSheetForm.imagesLabel}
                        </label>
                        <FileUpload
                            name="photos"
                            accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg"
                            multiple={true}
                            customUpload
                            chooseLabel={translations.dashboard.accountPage.userAccountComponent.avatarChooseLabel}
                            invalidFileSizeMessageSummary={translations.dashboard.accountPage.userAccountComponent.invalidFileSizeMessageSummary}
                            invalidFileSizeMessageDetail={translations.dashboard.accountPage.userAccountComponent.invalidFileSizeMessgage}
                            maxFileSize={5000000}
                            disabled={loading}
                            auto={false}
                            onSelect={(e) => setSelectedFiles(prev => [...prev, ...e.files])}
                            headerTemplate={(options) => {
                                const { className, chooseButton } = options
                                return (
                                    <div className={className} style={{ backgroundColor: 'transparent' }}>
                                        {chooseButton}
                                    </div>
                                )
                            }}
                            emptyTemplate={
                                <div className="flex gap-12 flex-wrap">
                                    {formData.img?.split(',')
                                        .filter((img: string) => img.trim() !== '')
                                        .map((img: string, index: number) => (
                                            img.trim() === '' ? null : (
                                                <div key={index} className="relative w-24 h-24">
                                                    <img
                                                        key={index}
                                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${img.trim()}?v=${Date.now()}`}
                                                        alt={`Image ${index + 1}`}
                                                        className="w-24 h-24 object-cover border rounded"
                                                    />
                                                    <Button
                                                        icon="pi pi-times"
                                                        rounded
                                                        text
                                                        severity="danger"
                                                        aria-label="Supprimer"
                                                        className="absolute h-5"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            if (advert?.id) handleRemoveImage(img, advert.id)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        ))}
                                </div>
                            }
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
