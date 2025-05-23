import {supabase} from "@/supabase";

export async function createReview(reviewData: object) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()

    if (error) {
        console.error("Erreur lors de la création de l'avis :", error)
        return { data: null, error }
    }

    return { data: data?.[0] || null, error: null }
}