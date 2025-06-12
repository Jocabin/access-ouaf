import { PrimeReactProvider } from 'primereact/api'
import { createClient } from '@/utils/supabase/server'
import React from 'react'
import UserAccount from '@/components/UserAccount'
import ChangePassword from '@/components/ChangePassword'
import { translations } from '@/lib/translations'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/login?redirect=${encodeURIComponent('/dashboard/account')}`)
    }

    const { data: addressData }  = await supabase.from('addresses').select().eq('auth_id', user?.id).single()

    return (
        <>
            <PrimeReactProvider>
                <div className="main--container">
                    <div className="main--content">
                        <h1 className="flex justify-center">{ translations.dashboard.accountPage.titlePage }</h1>

                        <div className="flex flex-col gap-4 sm:flex-row sm:space-x-4 w-full">
                            {user ? (
                                <>
                                    <UserAccount
                                        id={user.id}
                                        name={user.user_metadata.display_name}
                                        email={user.email}
                                        phone={user.user_metadata.phone}
                                        avatar={user.user_metadata.avatar_url}
                                        address={addressData?.address}
                                        postal_code={addressData?.postal_code}
                                        city={addressData?.city}
                                        country={addressData?.country}
                                    />
                                    <ChangePassword resetMode={false}/>
                                </>
                            ) : (
                                <p className="text-xl mt-40">{translations.dashboard.accountPage.userNotLogin}</p>
                            )}
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    )
}