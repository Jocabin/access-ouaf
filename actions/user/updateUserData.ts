'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateUserDataAction(userData: { email: string; name: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.updateUser({
        email: userData.email,
        data: { display_name: userData.name }
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function uploadAvatar (file: File, userId: string) {
    const supabase = await createClient()

    const fileName = `avatar_${userId}_${Date.now()}.${file.name.split('.').pop()}`

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        })

    if (error) {
        throw new Error('Erreur upload avatar : ' + error.message)
    }

    try {
        await updateUserDataAvatar(fileName)
    } catch (err) {
        console.error('Erreur updateUserDataAvatar :', err)
        throw err
    }

    return data
}

export async function deleteAvatar (fileName: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
        .from('avatars')
        .remove([fileName])

    if (error) {
        throw new Error('Erreur delete avatar : ' + error.message)
    }

    return data
}

export async function updateUserDataAvatar(fileName: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.updateUser({
        data: { avatar_url: fileName }
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}