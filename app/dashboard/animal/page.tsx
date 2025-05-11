import { createClient } from '@/utils/supabase/server'
import { getAnimalsByUser } from '@/services/animals.service'
import { redirect } from 'next/navigation'
import AnimalDashboard from '@/components/AnimalDashboard'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/animal')}`)
    }

    const animals = await getAnimalsByUser(user.id)
    return <AnimalDashboard animals={animals} />
}