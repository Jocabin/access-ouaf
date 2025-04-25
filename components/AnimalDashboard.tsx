'use client'
import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { translations } from '@/lib/translations'
import AnimalSheetForm from '@/components/AnimalSheetForm'

export default function AnimalDashboard({ animals }: { animals: any[] }) {
    const [formVisible, setFormVisible] = useState(false)
    const [selectedAnimal, setSelectedAnimal] = useState(null)

    return (
        <>
            <h1 className="flex justify-center">{translations.dashboard.animalPage.title}</h1>
            <div className="flex flex-col md:flex-row gap-4">
                {animals.map((animal) => (
                    <div key={animal.id} className="w-full md:w-1/2">
                        <div className="p-card p-4 border-round surface-card shadow-2">
                            <div className='flex justify-between'>
                                <h3>{animal.name}</h3>
                                <Button
                                    label="Modifier"
                                    icon="pi pi-pencil"
                                    className="p-button-text p-button-sm"
                                    onClick={() => {
                                        setSelectedAnimal(animal)
                                        setFormVisible(true)
                                    }}
                                />
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

            <Dialog visible={formVisible} onHide={() => setFormVisible(false)} header="Nouvel animal" style={{ width: '90vw', maxWidth: '800px' }} >
                <AnimalSheetForm animal={selectedAnimal} onSuccess={() => setFormVisible(false)} />
            </Dialog>
        </>
    )
}