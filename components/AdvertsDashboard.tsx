'use client'
import { useState } from 'react'
import { updateAdvert, deleteAdvert } from '@/services/adverts.service'
import { Category } from '@/types'
import NewAdModal from '@/components/NewAdModal'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { translations } from '@/lib/translations'

export interface Advert {
    id: string
    name: string
    brand: string
    state: string
    price: number
    img: string
}

export default function AdvertDashboard({ adverts, categories }: { adverts: Advert[]; categories: Category[] }) {
    const [formVisible, setFormVisible] = useState(false)
    const [advertList, setAdvertList] = useState(adverts)
    const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null)

    const handleDelete = async (id: string) => {
        await deleteAdvert(id)
        setAdvertList((prev) => prev.filter((a) => a.id !== id))
    }

    const confirmDelete = (id: string) => {
        confirmDialog({
            header: translations.dashboard.animalPage.dialogTitle,
            message: translations.dashboard.animalPage.dialogMessage,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: translations.dashboard.animalPage.acceptLabel,
            rejectLabel: translations.dashboard.animalPage.rejectLabel,
            accept: () => handleDelete(id),
            reject: () => null
        })
    }

    return (
        <>
            <ConfirmDialog />
            <h1 className="flex justify-center">{translations.dashboard.advertsPage.title}</h1>
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
                {advertList.map((advert) => (
                    <div key={advert.id} className="w-full md:basis-[calc(50%-0.5rem)]">
                        <div className="p-card p-4 border-round surface-card shadow-2">
                            <div className='flex justify-between items-center'>
                                <h3>{advert.name}</h3>
                                <div>
                                    <Button
                                        label={translations.dashboard.animalPage.editButton}
                                        icon="pi pi-pencil"
                                        className="p-button-text p-button-sm"
                                        onClick={() => {
                                            setSelectedAdvert(advert)
                                            setFormVisible(true)
                                        }}
                                    />
                                    <Button
                                        label={translations.dashboard.animalPage.deleteButton}
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-sm p-button-danger ml-2"
                                        onClick={() => confirmDelete(advert.id)}
                                    />
                                </div>
                            </div>
                            <p><strong>Marque :</strong> {advert.brand}</p>
                            <p><strong>État :</strong> {advert.state}</p>
                            <p><strong>Prix :</strong> {advert.price}€</p>
                            <p><strong>Image :</strong> {advert.img}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-row-reverse my-8'>
                <Button
                    label={translations.dashboard.advertsPage.newAdvert}
                    className='p-button-primary'
                    onClick={() => {
                        setSelectedAdvert(null)
                        setFormVisible(true)
                    }}
                />
            </div>

            <NewAdModal
                visible={formVisible}
                set_dialog_visible={setFormVisible}
                categories={categories}
                onHide={() => setFormVisible(false)}
                header={ selectedAdvert ? translations.dashboard.animalPage.animalSheetForm.headerEdit : translations.dashboard.animalPage.animalSheetForm.headerCreate } style={{ width: '90vw', maxWidth: '800px' }}
            />
        </>
    )
}