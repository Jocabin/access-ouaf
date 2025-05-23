import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateReview } from '@/components/CreateReview'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/orders')}`)
    }

    return <CreateReview />
}