import { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputNumber } from 'primereact/inputnumber'
import { createClient } from "@/src/utils/supabase/client";
import { translations } from '../translations'

interface PetProfileData {
    name: string;
    species: string;
    breed: string;
    age: number | null;
    gender: string;
    size: string;
    description: string;
  }
  
  interface DropdownOption {
    label: string;
    value: string;
  }
const AnimalSheetForm = ({ onSuccess }: { onSuccess: (animalData: PetProfileData) => void }) => {
    const supabase = createClient();
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: null as number | null,
        gender: '',
        size: '',
        description: ''    })
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)
    
    const genderOptions = [
        { label: translations.petProfile.genderMale, value: 'male' },
        { label: translations.petProfile.genderFemale, value: 'female' }
    ]
    
    const sizeOptions = [
        { label: translations.petProfile.sizeSmall, value: 'petit' },
        { label: translations.petProfile.sizeMedium, value: 'moyen' },
        { label: translations.petProfile.sizeBig, value: 'grand' }
    ]
    
    const speciesOptions = [
        { label: translations.petProfile.specieDog, value: 'chien' },
        { label: translations.petProfile.specieCat, value: 'chat' },
        { label: translations.petProfile.specieBird, value: 'oiseau' },
        { label: translations.petProfile.specieRodent, value: 'rongeur' },
        { label: translations.petProfile.specieReptile, value: 'reptile' },
        { label: translations.petProfile.specieOther, value: 'autre' }
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
            const petProfileData = {
                name: formData.name,
                species: formData.species,
                breed: formData.breed,
                age: formData.age,
                gender: formData.gender,
                size: formData.size,
                description: formData.description
            }
            
            const { data, error } = await supabase
                .from('pet_profile')
                .insert([petProfileData])
                .select()
                
            if (error) {
                throw error
            }
            
            if (data && data.length > 0) {
                onSuccess(data[0])
                toast.current?.show({
                    severity: 'success',
                    summary: translations.register.successSummary,
                    detail: translations.petProfile.successMessage,
                })
            }
        } catch (error: unknown) {
            toast.current?.show({
                severity: 'error',
                summary: translations.register.errorSummary,
                detail: error instanceof Error ? error.message : translations.petProfile.errorMessage,
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
                        <label htmlFor="name">{translations.petProfile.name}</label>
                        <InputText
                            id="name"
                            name="name"
                            className="p-inputtext-sm"
                            placeholder={translations.petProfile.placeholdername}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="species">{translations.petProfile.specie}</label>
                        <Dropdown
                            id="species"
                            value={formData.species}
                            options={speciesOptions}
                            onChange={(e) => handleDropdownChange('species', e.value)}
                            placeholder={translations.petProfile.placeholderSpecie}
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="breed">{translations.petProfile.breed}</label>
                        <InputText
                            id="breed"
                            name="breed"
                            className="p-inputtext-sm"
                            placeholder={translations.petProfile.placeholderBreed}
                            value={formData.breed}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="age">{translations.petProfile.age}</label>
                        <InputNumber
                            id="age"
                            value={formData.age}
                            onValueChange={(e) => handleNumberChange('age', e.value ?? null)}
                            min={0}
                            max={100}
                            placeholder={translations.petProfile.placeholderAge}
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="gender">{translations.petProfile.gender}</label>
                        <Dropdown
                            id="gender"
                            value={formData.gender}
                            options={genderOptions}
                            onChange={(e) => handleDropdownChange('gender', e.value)}
                            placeholder={translations.petProfile.placeholderGender
                            }
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="size">{translations.petProfile.size}</label>
                        <Dropdown
                            id="size"
                            value={formData.size}
                            options={sizeOptions}
                            onChange={(e) => handleDropdownChange('size', e.value)}
                            placeholder={translations.petProfile.placeholderSize}
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">{translations.petProfile.description}</label>
                        <InputTextarea
                            id="description"
                            name="description"
                            rows={5}
                            placeholder={translations.petProfile.placeholderDescription}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <Button type="submit" className="flex justify-center mt-4" loading={loading}>
                        {translations.petProfile.submitButton}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AnimalSheetForm