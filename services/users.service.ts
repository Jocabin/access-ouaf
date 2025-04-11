import { createClient } from '@/utils/supabase/server'

export async function updateUser(userData: { email: string; name: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.updateUser({
        email: userData.email,
        data: {
            display_name: userData.name
        }
    })

    if (error) {
        console.error("Erreur lors de la mise à jour :", error)
        return null
    }

    return data
}

export async function updateUserPassword(password: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        console.error("Erreur lors de la mise à jour du mot de passe :", error)
        return null
    }

    return data
}
