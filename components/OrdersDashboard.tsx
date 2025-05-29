'use client'
import React, { useState } from 'react'
import { Product } from '@/types'
import CreateReview from '@/components/CreateReview'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Image } from 'primereact/image'
import {Dialog} from 'primereact/dialog'
import {translations} from '@/lib/translations'

export interface Order {
    id: string
    created_at: string
    product: Product
    orders_reviews?: { id: string }[]
}

export default function OrdersDashboard({ orders }: { orders: Order[] }) {
    const [formVisible, setFormVisible] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Mes commandes</h2>
            {orders.length === 0 ? (
                <p>Aucune commande trouvée.</p>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {orders.map((order) => (
                        <Card
                            key={order.id}
                            className="w-[320px] shadow-sm"
                            footer={
                                <div className="flex flex-col gap-2">
                                    <Button
                                        label={order.orders_reviews?.length ? "Avis publié" : "Publier un avis"}
                                        icon="pi pi-pen-to-square"
                                        className="w-full"
                                        disabled={!!order.orders_reviews?.length}
                                        onClick={() => {
                                            setSelectedOrder(order)
                                            setFormVisible(true)
                                        }}
                                    />
                                    {order.orders_reviews?.length > 0 && (
                                        <span className="text-sm text-green-600 text-center">{translations.dashboard.ordersPage.reviewAlreadyPublished}</span>
                                    )}
                                </div>
                            }
                        >
                            <div className="flex flex-col items-center gap-3">
                                {order.product?.img && (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${order.product.img.split(',')[0]}`}
                                        alt={order.product.name}
                                        width="200"
                                    />
                                )}
                                <div className="text-center">
                                    <h3 className="font-medium text-lg mb-1">{order.product?.name}</h3>
                                    <div className="text-sm text-gray-500 mb-1">
                                        Commande passée le {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-md font-semibold">{order.product?.price} €</div>
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
                header={ translations.dashboard.ordersPage.title }
                style={{ width: '90vw', maxWidth: '800px' }}
            >
                <CreateReview
                    productUserId={selectedOrder?.product.user_id} orderUserId={selectedOrder?.user_id} orderId={selectedOrder?.id}
                    onSuccess={() => {
                        setFormVisible(false)
                    }}
                />
            </Dialog>
        </div>
    )
}