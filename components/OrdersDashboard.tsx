"use client"
import React, { useState } from "react"
import { Product } from "@/types"
import CreateReview from "@/components/CreateReview"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Image } from "primereact/image"
import { Dialog } from "primereact/dialog"
import { translations } from "@/lib/translations"
import DashboardBreadcrumb from "./DashboardBreadcrumb"

export interface Order {
  id: number
  created_at: string
  product: Product
  user_id: string
  orders_reviews?: { id: string }[]
}

export default function OrdersDashboard({ orders }: { orders: Order[] }) {
  const [formVisible, setFormVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  return (
    <>
      <DashboardBreadcrumb pageName={translations.dashboard.ordersPage.title} pageSlug="orders" />

      <div>
        <h1 className="flex justify-center pb-6">
          {translations.dashboard.ordersPage.title}
        </h1>
        {orders.length === 0 ? (
          <p>{translations.dashboard.ordersPage.noOrders}</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="w-[320px] shadow-sm"
                footer={
                  <div className="flex flex-col gap-2">
                    <Button
                      label={
                        order.orders_reviews?.length
                          ? "Avis publié"
                          : "Publier un avis"
                      }
                      icon="pi pi-pen-to-square"
                      className="w-full"
                      disabled={!!order.orders_reviews?.length}
                      onClick={() => {
                        setSelectedOrder(order)
                        setFormVisible(true)
                      }}
                    />
                    {order.orders_reviews &&
                      order.orders_reviews.length > 0 && (
                        <span className="text-sm text-green-600 text-center">
                          {
                            translations.dashboard.ordersPage
                              .reviewAlreadyPublished
                          }
                        </span>
                      )}
                  </div>
                }
              >
                <div className="flex flex-col items-center gap-3">
                  {order.product?.img && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${
                        process.env.NEXT_PUBLIC_IMG_URL
                      }${order.product.img.split(",")[0]}`}
                      alt={order.product.name}
                      width="200"
                    />
                  )}
                  <div className="text-center">
                    <h3 className="font-medium text-lg mb-1">
                      {order.product?.name}
                    </h3>
                    <div className="text-sm text-gray-500 mb-1">
                      Commande passée le{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-md font-semibold">
                      {order.product?.price} €
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        <Dialog
          visible={formVisible}
          draggable={false}
          onHide={() => setFormVisible(false)}
          header={translations.dashboard.ordersPage.dialogTitle}
          style={{ width: "90vw", maxWidth: "800px" }}
        >
          <CreateReview
            productUserId={selectedOrder?.product.user_id}
            orderUserId={selectedOrder?.user_id}
            orderId={selectedOrder?.id}
            onSuccess={() => {
              setFormVisible(false)
            }}
          />
        </Dialog>
      </div>
    </>
  )
}
