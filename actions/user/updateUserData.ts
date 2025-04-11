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