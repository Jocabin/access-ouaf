import { createClient } from '@/utils/supabase/server'

export async function fetchUser(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .rpc('get_user_by_id', { uid: id })

    if (error) {
        console.error("Erreur lors de la récupération du profil :", error)
        return null
    }

    return data
}

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

export async function uploadAvatarToSupabase (file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userData.id}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        })

    if (error) {
        throw new Error('Erreur upload avatar : ' + error.message)
    }

    const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName)

    return publicUrlData.publicUrl
}
