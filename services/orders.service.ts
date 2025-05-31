import {supabase} from "@/supabase";


export async function getOrdersByUser(userId: string) {
    const { data, error } = await supabase
        .from('orders')
        .select('*, product:product_id (*), orders_reviews(*)')
        .eq('user_id', userId)

    if (error) {
        console.error("Erreur lors de la récupération des commandes :", error)
        return []
    }

    return data
}