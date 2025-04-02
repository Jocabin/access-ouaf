import { PrimeReactProvider } from 'primereact/api'
import { createClient } from '@/src/utils/supabase/server'
import React from 'react'
import UserAccount from '@/app/components/UserAccount'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <>
            <PrimeReactProvider>
                <div className="main--container">
                    <div className="main--content">
                        <h1 className="flex justify-center">Votre compte</h1>

                        <div className="flex gap-4 flex-wrap">
                            {user ? (
                                <UserAccount
                                    name={user.user_metadata.display_name}
                                    email={user.user_metadata.email}
                                />
                            ) : (
                                <p>Utilisateur non connecté</p>
                            )}

                            <Card title="Mot de passe" className="flex-1">
                                <div className="p-fluid">
                                    <div className="p-field flex flex-col gap-2">
                                        <label htmlFor="password">Nouveau mot de passe</label>
                                        <InputText id="password" name="password" type="password" />
                                    </div>
                                    <Button label="Modifier" className="p-button-warning mt-4" />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    )
}