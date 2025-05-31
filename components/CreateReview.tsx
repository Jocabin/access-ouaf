'use client'
import React, { useRef, useState } from 'react'
import { createReview } from '@/services/reviews.service'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Rating } from 'primereact/rating'
import { translations } from '@/lib/translations'

interface CreateReviewProps {
    productUserId?: string
    orderUserId?: string
    orderId?: number
}

export function CreateReview({ productUserId, orderUserId, orderId, onSuccess }: CreateReviewProps & { onSuccess: () => void }) {
    const [rating, setRating] = useState<number | undefined>(undefined)
    const [comment, setComment] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast | null>(null)

    const newReview = async () => {
        setLoading(true)
        try {
            const reviewData = {
                from_user_id: orderUserId,
                to_user_id: productUserId,
                rating: rating,
                comment: comment,
            }

            if (!orderId) {
                throw new Error('orderId est requis pour créer un avis.')
            }

            const { data, error } = await createReview(reviewData, orderId)

            if (error) {
                throw error
            }

            if (data) {
                toast.current?.show({
                    severity: 'success',
                    summary: translations.register.successSummary,
                    detail: translations.dashboard.ordersPage.sucessMessage,
                })
                onSuccess()
            }
        } catch (error: unknown) {
            toast.current?.show({
                severity: 'error',
                summary: translations.register.errorSummary,
                detail: error instanceof Error ? error.message : translations.dashboard.ordersPage.errorMessage,
            })
            console.error('Erreur:', error)
        }
        setLoading(false)
    }

    return (
        <>
            <div className="flex justify-center items-center w-full">
                <div className="flex-1 justify-center max-w-[800px]">
                    <Toast ref={toast}/>
                    <div className="flex flex-col gap-4 p-fluid">
                        <div className="p-field flex flex-col gap-2">
                            <label htmlFor="rating">
                                {translations.dashboard.ordersPage.note}
                            </label>
                            <Rating
                                id="rating"
                                name="rating"
                                value={rating}
                                cancel={false}
                                onChange={(e) => setRating(e.value ?? undefined)}
                                required
                            />
                        </div>
                        <div className="p-field flex flex-col gap-2">
                            <label htmlFor="comment">
                                {translations.dashboard.ordersPage.comment}
                            </label>
                            <InputText
                                id="comment"
                                name="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            label={translations.dashboard.ordersPage.send}
                            className="p-button-warning mt-4"
                            disabled={rating === null || comment === null}
                            loading={loading}
                            onClick={newReview}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateReview