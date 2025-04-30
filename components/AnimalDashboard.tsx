'use client'
import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { translations } from '@/lib/translations'
import AnimalSheetForm from '@/components/AnimalSheetForm'
import { deleteAnimal } from '@/services/animals.service'

export default function AnimalDashboard({ animals }: { animals: any[] }) {
    const [formVisible, setFormVisible] = useState(false)
    const [animalList, setAnimalList] = useState(animals)
    const [selectedAnimal, setSelectedAnimal] = useState(null)

    const handleDelete = async (id: string) => {
        await deleteAnimal(id)
        setAnimalList((prev) => prev.filter((a) => a.id !== id))
    }

    return (
        <>
            <h1 className="flex justify-center">{translations.dashboard.animalPage.title}</h1>
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
                {animalList.map((animal) => (
                    <div key={animal.id} className="w-full md:basis-[calc(50%-0.5rem)]">
                        <div className="p-card p-4 border-round surface-card shadow-2">
                            <div className='flex justify-between'>
                                <h3>{animal.name}</h3>
                                <div>
                                    <Button
                                        label={translations.dashboard.animalPage.editButton}
                                        icon="pi pi-pencil"
                                        className="p-button-text p-button-sm"
                                        onClick={() => {
                                            setSelectedAnimal(animal)
                                            setFormVisible(true)
                                        }}
                                    />
                                    <Button
                                        label={translations.dashboard.animalPage.deleteButton}
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-sm p-button-danger ml-2"
                                        onClick={() => handleDelete(animal.id)}
                                    />
                                </div>
                            </div>
                            <p><strong>Espèce :</strong> {animal.species}</p>
                            <p><strong>Race :</strong> {animal.breed}</p>
                            <p><strong>Âge :</strong> {animal.age} {animal.age === 1 ? 'an' : 'ans'}</p>
                            <p><strong>Sexe :</strong> {animal.gender}</p>
                            <p><strong>Taille :</strong> {animal.size}</p>
                            <p><strong>Description :</strong> {animal.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-row-reverse my-8'>
                <Button
                    label={translations.dashboard.animalPage.newAnimal}
                    className='p-button-primary'
                    onClick={() => {
                        setSelectedAnimal(null)
                        setFormVisible(true)
                    }}
                />
            </div>

            <Dialog visible={formVisible} onHide={() => setFormVisible(false)} header={ selectedAnimal ? translations.dashboard.animalPage.animalSheetForm.headerEdit : translations.dashboard.animalPage.animalSheetForm.headerCreate } style={{ width: '90vw', maxWidth: '800px' }} >
                <AnimalSheetForm
                    animal={selectedAnimal}
                    onSuccess={(updatedAnimal) => {
                        if (selectedAnimal) {
                            setAnimalList((prev) =>
                                prev.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a))
                            )
                        } else {
                            setAnimalList((prev) => [...prev, updatedAnimal])
                        }
                        setFormVisible(false)
                    }}
                />
            </Dialog>
        </>
    )
}