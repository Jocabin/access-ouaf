import { PrimeReactProvider } from 'primereact/api'
import { createClient } from '@/src/utils/supabase/server'
import React from 'react'
import UserAccount from '@/app/components/UserAccount'
import ResetPassword from '@/app/components/ResetPassword'
import { translations } from '../../translations'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <>
            <PrimeReactProvider>
                <div className="main--container">
                    <div className="main--content">
                        <h1 className="flex justify-center">{ translations.dashboard.accountPage.titlePage }</h1>

                        <div className="flex gap-4 justify-center flex-wrap">
                            {user ? (
                                <>
                                    <UserAccount
                                        name={user.user_metadata.display_name}
                                        email={user.user_metadata.email}
                                        phone={user.user_metadata.phone}
                                    />
                                    <ResetPassword />
                                </>
                            ) : (
                                <p className="text-xl mt-40">{ translations.dashboard.accountPage.userNotLogin }</p>
                            )}
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    )
}