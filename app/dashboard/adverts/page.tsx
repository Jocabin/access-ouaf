import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getProductsByUser } from '@/services/products.service'
import { getAllCategories } from '@/services/categories.service'
import AdvertsDashboard from '@/components/AdvertsDashboard'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/adverts')}`)
    }

    const adverts = await getProductsByUser(user.id)
    const categories = await getAllCategories()
    console.log(categories)
    return <AdvertsDashboard adverts={adverts} categories={categories} />
}