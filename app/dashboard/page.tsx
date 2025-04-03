import { PrimeReactProvider } from 'primereact/api'
import { Card } from 'primereact/card'
import React from 'react'
import { translations } from '../translations'

const footerInfo = (
    <>
        <a href="/dashboard/account" rel="noopener noreferrer" className="p-button">
            { translations.dashboard.btnCardFooter }
        </a>
    </>
)

const footerCommandes = (
    <>
        <a href="" rel="noopener noreferrer" className="p-button">
            { translations.dashboard.btnCardFooter }
        </a>
    </>
)

const footerAnimaux = (
    <>
        <a href="" rel="noopener noreferrer" className="p-button">
            { translations.dashboard.btnCardFooter }
        </a>
    </>
)

const footerAnnonces = (
    <>
        <a href="" rel="noopener noreferrer" className="p-button">
            { translations.dashboard.btnCardFooter }
        </a>
    </>
)

export default async function DashboardPage() {
    return (
        <>
            <PrimeReactProvider>
                <div className="main--container">
                    <div className="main--content">
                        <h1 className="flex justify-center">{ translations.dashboard.title }</h1>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex space-x-4">
                                <Card title="Vos informations" footer={ footerInfo } className="flex-1">
                                    <p>{ translations.dashboard.cardInformationsContent }</p>
                                </Card>
                                <Card title="Vos commandes" footer={ footerCommandes } className="flex-1">
                                    <p>{ translations.dashboard.cardCommandesContent }</p>
                                </Card>
                            </div>
                            <div className="flex space-x-4">
                                <Card title="Vos animaux" footer={ footerAnimaux } className="flex-1">
                                    <p>{ translations.dashboard.cardAnimauxContent }</p>
                                </Card>
                                <Card title="Vos annonces" footer={ footerAnnonces } className="flex-1">
                                    <p>{ translations.dashboard.cardAnnoncesContent }</p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    )
}