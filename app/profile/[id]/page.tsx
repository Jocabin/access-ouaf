import React from "react";
import Link from 'next/link'
import Image from 'next/image'
import { fetchUser } from '@/services/users.service'
import { getProductsByUser} from '@/services/products.service'
import { getReviewsByUser } from '@/services/reviews.service'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'
import { Rating } from 'primereact/rating'
import { TabView, TabPanel } from 'primereact/tabview'

interface Annonce {
    id: string
    slug: string
    img: string
    name: string
    brand: string
    state: string
    price: number
}

export default async function ProductPage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await fetchUser(id)
    const annonces = await getProductsByUser(id) ?? []
    const reviewsData = await getReviewsByUser(id) ?? []

    const memberSince = formatDistanceToNow(new Date(user?.created_at), { locale: fr })

    return (
        <div className='flex flex-col items-center gap-10 my-10'>
            <div className='flex flex-col items-center gap-2'>
                <Avatar
                    className="avatar-fixed"
                    image={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_AVATAR_URL}${user.raw_meta_data.avatar_url}` || undefined}
                    icon={!user.raw_meta_data.avatar_url ? 'pi pi-user' : undefined}
                    size="xlarge"
                    shape="circle"
                    style={{ width: '64px', height: '64px', overflow: 'hidden' }}
                />
                <span className='font-bold'>{user.raw_meta_data.display_name}</span>
                <span className='text-sm'>Membre depuis {memberSince}</span>
                <Rating className='no-opacity-disabled' value={reviewsData.averageRating} disabled cancel={false} />
            </div>
            <TabView className='w-full md:w-[500px]'>
                <TabPanel header='Annonces en ligne'>
                <div className='flex flex-col items-center'>
                    <div className="mt-4">
                        {annonces.length > 0 ? (
                            <ul className="flex flex-col list-none space-y-4 m-0 p-0">
                                {annonces.map((annonce: Annonce) => (
                                    <li key={annonce.id}>
                                        <Link href={`/items/${annonce.slug}`} className="no-underline text-inherit">
                                            <Card className="p-0 w-[90vw] md:w-[500px]">
                                                <div className="p-4 flex flex-row items-center gap-4">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${annonce.img}`}
                                                        alt={`${annonce.slug}`}
                                                        width={ 100 }
                                                        height={ 100 }
                                                    />
                                                    <div className='flex flex-col'>
                                                        <span className='font-semibold mb-2'>{annonce.name}</span>
                                                        <span>{annonce.brand}</span>
                                                        <span>État : {annonce.state}</span>
                                                        <span>{annonce.price}€</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucune annonce</p>
                        )}
                    </div>
                </div>
                </TabPanel>
                <TabPanel header="Avis">
                    <div className='flex flex-col items-center'>
                        <div className="mt-4">
                            {reviewsData.reviews?.length > 0 ? (
                                <ul className="flex flex-col list-none space-y-4 m-0 p-0">
                                    {reviewsData.reviews.map((review: {
                                        id: string;
                                        rating: number;
                                        comment: string;
                                        created_at: string;
                                    }) => (
                                        <li key={review.id}>
                                            <Card className="p-0 w-[90vw] md:w-[500px]">
                                                <div className="flex flex-col gap-2">
                                                    <Rating className='no-opacity-disabled' value={review.rating} disabled cancel={false} />
                                                    <p className="m-0">{review.comment}</p>
                                                    <span className="text-sm text-gray-500">
                                                        Il y a {formatDistanceToNow(new Date(review.created_at), {locale: fr})}
                                                    </span>
                                                </div>
                                            </Card>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Aucun avis</p>
                            )}
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    )
}