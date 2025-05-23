import {supabase} from "@/supabase";


export async function getReviewsByUser(userId: string) {
    const { data, error } = await supabase
        .from('reviews')
        .select()
        .eq('to_user_id', userId)

    if (error) {
        console.error("Erreur lors de la récupération des reviews :", error)
        return []
    }

    const averageRating = data.reduce((acc, review) => acc + review.rating, 0) / data.length || 0

    return {
        reviews: data,
        totalReviews: data.length,
        averageRating: parseFloat(averageRating.toFixed(1))
    }
}

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