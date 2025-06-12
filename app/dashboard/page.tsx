import { PrimeReactProvider } from "primereact/api"
import { Card } from "primereact/card"
import React from "react"
import { translations } from "@/lib/translations"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

const footerInfo = (
  <>
    <a
      href="/dashboard/account"
      rel="noopener noreferrer"
      className="p-button no-underline"
    >
      {translations.dashboard.btnCardFooter}
    </a>
  </>
)

const footerCommandes = (
  <>
    <a
      href="/dashboard/orders"
      rel="noopener noreferrer"
      className="p-button no-underline"
    >
      {translations.dashboard.btnCardFooter}
    </a>
  </>
)

const footerAnimaux = (
  <>
    <a
      href="/dashboard/animal"
      rel="noopener noreferrer"
      className="p-button no-underline"
    >
      {translations.dashboard.btnCardFooter}
    </a>
  </>
)

const footerAnnonces = (
  <>
    <a
      href="/dashboard/adverts"
      rel="noopener noreferrer"
      className="p-button no-underline"
    >
      {translations.dashboard.btnCardFooter}
    </a>
  </>
)

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/dashboard")}`)
  }

  return (
    <>
      <PrimeReactProvider>
        <div className="main--container">
          <div className="main--content">
            <h1 className="flex justify-center pb-6">
              {translations.dashboard.title}
            </h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:space-x-4 w-full">
                <Card
                  title="Vos informations"
                  footer={footerInfo}
                  className="flex-1"
                >
                  <p>{translations.dashboard.cardInformationsContent}</p>
                </Card>
                <Card
                  title="Vos commandes"
                  footer={footerCommandes}
                  className="flex-1"
                >
                  <p>{translations.dashboard.cardCommandesContent}</p>
                </Card>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:space-x-4 w-full">
                <Card
                  title="Vos animaux"
                  footer={footerAnimaux}
                  className="flex-1"
                >
                  <p>{translations.dashboard.cardAnimauxContent}</p>
                </Card>
                <Card
                  title="Vos annonces"
                  footer={footerAnnonces}
                  className="flex-1"
                >
                  <p>{translations.dashboard.cardAnnoncesContent}</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PrimeReactProvider>
    </>
  )
}
