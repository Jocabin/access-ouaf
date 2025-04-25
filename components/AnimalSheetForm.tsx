import { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputNumber } from 'primereact/inputnumber'
import { createClient } from '@/utils/supabase/client'
import { createAnimal, updateAnimal } from '@/services/animals.service'
import { translations } from '@/lib/translations'

export interface animalData {
    animal: object
}
  
interface DropdownOption {
    label: string
    value: string
}
const AnimalSheetForm = ({ animal }: animalData) => {
    const supabase = createClient()
    const [formData, setFormData] = useState({
        name: animal?.name || '',
        species: animal?.species || '',
        breed: animal?.breed || '',
        age: animal?.age ?? null,
        gender: animal?.gender || '',
        size: animal?.size || '',
        description: animal?.description || ''
    })
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)
    
    const genderOptions = [
        { label: translations.dashboard.animalPage.animalSheetForm.genderMale, value: 'male' },
        { label: translations.dashboard.animalPage.animalSheetForm.genderFemale, value: 'female' }
    ]
    
    const sizeOptions = [
        { label: translations.dashboard.animalPage.animalSheetForm.sizeSmall, value: 'petit' },
        { label: translations.dashboard.animalPage.animalSheetForm.sizeMedium, value: 'moyen' },
        { label: translations.dashboard.animalPage.animalSheetForm.sizeBig, value: 'grand' }
    ]
    
    const speciesOptions = [
        { label: translations.dashboard.animalPage.animalSheetForm.speciesDog, value: 'chien' },
        { label: translations.dashboard.animalPage.animalSheetForm.speciesCat, value: 'chat' },
        { label: translations.dashboard.animalPage.animalSheetForm.speciesBird, value: 'oiseau' },
        { label: translations.dashboard.animalPage.animalSheetForm.speciesRodent, value: 'rongeur' },
        { label: translations.dashboard.animalPage.animalSheetForm.speciesReptile, value: 'reptile' },
        { label: translations.dashboard.animalPage.animalSheetForm.speciesHorse, value: 'cheval' },
        { label: translations.dashboard.animalPage.animalSheetForm.speciesOther, value: 'autre' }
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

            const animalData = {
                name: formData.name,
                species: formData.species,
                breed: formData.breed,
                age: formData.age,
                gender: formData.gender,
                size: formData.size,
                description: formData.description,
                user_uuid: user.id
            }

            let data, error
            if (animal?.id) {
                await updateAnimal(animal.id, animalData)
            } else {
                await createAnimal(animalData)
            }

            if (error) {
                throw error
            }
            
            if (data && data.length > 0) {
                onSuccess(data[0])
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


    return (
        <div>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">{translations.dashboard.animalPage.animalSheetForm.name}</label>
                        <InputText
                            id="name"
                            name="name"
                            className="p-inputtext-sm"
                            placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderName}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="species">{translations.dashboard.animalPage.animalSheetForm.species}</label>
                            <Dropdown
                                id="species"
                                value={formData.species}
                                options={speciesOptions}
                                onChange={(e) => handleDropdownChange('species', e.value)}
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderSpecies}
                                className="w-full p-inputtext-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="breed">{translations.dashboard.animalPage.animalSheetForm.breed}</label>
                            <InputText
                                id="breed"
                                name="breed"
                                className="p-inputtext-sm"
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderBreed}
                                value={formData.breed}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="age">{translations.dashboard.animalPage.animalSheetForm.age}</label>
                            <InputNumber
                                id="age"
                                value={formData.age}
                                onValueChange={(e) => handleNumberChange('age', e.value ?? null)}
                                min={0}
                                max={100}
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderAge}
                                className="w-full p-inputtext-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="size">{translations.dashboard.animalPage.animalSheetForm.size}</label>
                            <Dropdown
                                id="size"
                                value={formData.size}
                                options={sizeOptions}
                                onChange={(e) => handleDropdownChange('size', e.value)}
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderSize}
                                className="w-full p-inputtext-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="gender">{translations.dashboard.animalPage.animalSheetForm.gender}</label>
                            <Dropdown
                                id="gender"
                                value={formData.gender}
                                options={genderOptions}
                                onChange={(e) => handleDropdownChange('gender', e.value)}
                                placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderGender}
                                className="w-full p-inputtext-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">{translations.dashboard.animalPage.animalSheetForm.description}</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            rows={5}
                            placeholder={translations.dashboard.animalPage.animalSheetForm.placeholderDescription}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-inputtext-sm"
                            required
                        />
                    </div>

                    <Button type="submit" className="flex justify-center mt-4" loading={loading}>
                        { animal ? translations.dashboard.animalPage.animalSheetForm.submitButtonEdit : translations.dashboard.animalPage.animalSheetForm.submitButtonCreate }
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AnimalSheetForm
