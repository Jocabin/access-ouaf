import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/adverts')}`)
    }

    return <span>Adverts</span>
}