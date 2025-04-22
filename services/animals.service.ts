import { supabase } from "@/supabase"

export async function getAnimalsByUser(userId: string) {
    const { data, error } = await supabase
        .from('animals')
        .select()
        .eq('user_uuid', userId)

    if (error) {
        console.error("Erreur lors de la récupération des animaux :", error)
        return []
    }

    return data
}
