import { supabase } from "@/supabase"

export async function updateAddress(userData: {
    country: string;
    address: string;
    city: string;
    id: string;
    postal_code: string;
}) {
    const { data, error } = await supabase
        .from('addresses')
        .update({
            address: userData.address,
            postal_code: userData.postal_code,
            city: userData.city,
            country: userData.country,
        })
        .eq('auth_id', userData.id)
        .select()

    if (error) {
        console.error("Erreur lors de la mise à jour :", error)
        return null
    }

    return data
}
