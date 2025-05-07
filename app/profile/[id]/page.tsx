import { fetchUser } from '@/services/users.service'
import { getProductsByUser} from '@/services/products.service'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'

export default async function ProductPage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await fetchUser(id)
    const annonces = await getProductsByUser(id)

    const memberSince = formatDistanceToNow(new Date(user?.created_at), { locale: fr })

    return (
        <div className='flex flex-col items-center gap-10 mt-10'>
            <div className='flex flex-col items-center gap-2'>
                <Avatar icon="pi pi-user" size="xlarge" shape="circle"/>
                <span className='font-bold'>{user.raw_meta_data.display_name}</span>
                <span className='text-sm'>Membre depuis {memberSince}</span>
            </div>
            <div>
                <span>Annonces en ligne</span>
                <div className="mt-4">
                    {annonces.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {annonces.map((annonce: any) => (
                                <li key={annonce.id}>
                                    <Card>
                                        <span>{annonce.brand}</span>
                                        <span>{annonce.slug}</span>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucune annonce</p>
                    )}
                </div>
            </div>
        </div>
    )
}