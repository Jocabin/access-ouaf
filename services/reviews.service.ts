import {supabase} from "@/supabase";
import type { ReviewsData } from '@/types'


export async function getReviewsByUser(userId: string): Promise<ReviewsData | null> {
    const { data, error } = await supabase
        .from('reviews')
        .select()
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false })

    if (error || !data) {
        console.error("Erreur lors de la récupération des reviews :", error)
        return null
    }

    const averageRating = data.reduce((acc, review) => acc + review.rating, 0) / data.length || 0

    return {
        reviews: data,
        totalReviews: data.length,
        averageRating: parseFloat(averageRating.toFixed(1)),
    }
}

export async function createReview(reviewData: object, orderId: number) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()

    if (error) {
        console.error("Erreur lors de la création de l'avis :", error)
        return { data: null, error }
    }

    const review = data?.[0] || null

    if (review && orderId) {
        const { error: pivotError } = await supabase
            .from('orders_reviews')
            .insert([{ order_id: orderId, review_id: review.id }])

        if (pivotError) {
            console.error("Erreur lors de l'insertion dans la table pivot :", pivotError)
        }
    }

    return { data: review, error: null }
}