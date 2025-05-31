import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getOrdersByUser } from '@/services/orders.service'
import OrdersDashboard from '@/components/OrdersDashboard'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/orders')}`)
    }

    const orders = await getOrdersByUser(user.id)

    return <OrdersDashboard orders={orders} />
}