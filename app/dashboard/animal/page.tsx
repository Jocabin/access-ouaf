import { createClient } from '@/utils/supabase/server'
import React from 'react'
import { redirect } from 'next/navigation'
import { getAnimalsByUser } from '@/services/animals.service'
import {translations} from "@/lib/translations";

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/animal')}`)
    }
    const animals = await getAnimalsByUser(user?.id)

    return (
        <div>
            <h1 className="flex justify-center">{ translations.dashboard.animalPage.title }</h1>
            <div className="flex flex-row gap-4">
                {animals.map((animal: never) => (
                    <div key={animal.id} className="w-1/2">
                        <div className="p-card p-4 border-round surface-card shadow-2">
                            <h3>{animal.name}</h3>
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
        </div>
    )
}