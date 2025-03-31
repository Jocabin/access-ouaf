import { PrimeReactProvider } from 'primereact/api'
import React from 'react'

export default async function AccountPage() {
    return (
        <>
            <PrimeReactProvider>
                <div className="main--container">
                    <div className="main--content">
                        <h1 className="flex justify-center">Votre compte</h1>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    )
}