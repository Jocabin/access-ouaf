import { supabase } from "@/supabase"

export async function getAnimalsByUser(userId: string) {
    const { data, error } = await supabase
        .from('animals')
        .select()
        .eq('user_uuid', userId)
        .order('name')

    if (error) {
        console.error("Erreur lors de la récupération des animaux :", error)
        return []
    }

    return data
}

export async function createAnimal(animalData: object) {
    const { data, error } = await supabase
        .from('animals')
        .insert([animalData])
        .select()

    if (error) {
        console.error("Erreur lors de la création de l'animal :", error)
        return { data: null, error }
    }

    return { data: data?.[0] || null, error: null }
}

export async function updateAnimal(animalId: string, animalData: object) {
    const { data, error } = await supabase
        .from('animals')
        .update(animalData)
        .eq('id', animalId)
        .select()

    if (error) {
        console.error("Erreur lors de la modification de l'animal :", error)
        return { data: null, error }
    }

    return { data: data?.[0] || null, error: null }
}

export async function deleteAnimal(animalId: string) {
    const { data, error } = await supabase
        .from('animals')
        .delete()
        .eq('id', animalId)

    if (error) {
        console.error("Erreur lors de la suppression de l'animal :", error)
        return { data: null, error }
    }

    return { data: data?.[0] || null, error: null }
}
