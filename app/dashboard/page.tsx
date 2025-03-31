import { PrimeReactProvider } from 'primereact/api'
import { Card } from 'primereact/card'
import React from 'react'

const footerInfo = (
    <>
        <a href="/dashboard/account" rel="noopener noreferrer" className="p-button">
            Accéder
        </a>
    </>
)

const footerCommandes = (
    <>
        <a href="/dashboard/account" rel="noopener noreferrer" className="p-button">
            Accéder
        </a>
    </>
)

const footerAnimaux = (
    <>
        <a href="/dashboard/account" rel="noopener noreferrer" className="p-button">
            Accéder
        </a>
    </>
)

const footerJSP = (
    <>
        <a href="/dashboard/account" rel="noopener noreferrer" className="p-button">
            Accéder
        </a>
    </>
)

export default async function DashboardPage() {
    return (
        <>
            <PrimeReactProvider>
                <div className="main--container">
                    <div className="main--content">
                        <h1 className="flex justify-center">Votre espace client</h1>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex space-x-4">
                                <Card title="Vos informations" footer={ footerInfo } className="flex-1">
                                    <p className="m-0">
                                        Consultez ou modifiez vos données personnelles
                                    </p>
                                </Card>
                                <Card title="Vos commandes" footer={ footerCommandes } className="flex-1">
                                    <p className="m-0">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                                        consequuntur error repudiandae
                                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa
                                        ratione quam perferendis esse, cupiditate neque quas!
                                    </p>
                                </Card>
                            </div>
                            <div className="flex space-x-4">
                                <Card title="Vos animaux" footer={ footerAnimaux } className="flex-1">
                                    <p className="m-0">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                                        consequuntur error repudiandae
                                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa
                                        ratione quam perferendis esse, cupiditate neque quas!
                                    </p>
                                </Card>
                                <Card title="Vos je sais pas" footer={ footerJSP } className="flex-1">
                                    <p className="m-0">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                                        consequuntur error repudiandae
                                        numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa
                                        ratione quam perferendis esse, cupiditate neque quas!
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    )
}