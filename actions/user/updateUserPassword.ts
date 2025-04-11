'use server'

import { createClient } from '@/utils/supabase/server'

export async function updatePasswordAction(password: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.updateUser({
        password
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}
