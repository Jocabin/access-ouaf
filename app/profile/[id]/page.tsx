import { createClient } from '@/utils/supabase/server'
import {Avatar} from 'primereact/avatar'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function ProductPage({params}: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params
    const { data: user, errorUser } = await supabase
        .rpc('get_user_by_id', { uid: id })

    if (errorUser) {
        console.error(errorUser)
        return <div>Erreur lors du chargement des données</div>
    }

    const memberSince = formatDistanceToNow(new Date(user.created_at), { locale: fr })

    return (
        <div className='flex flex-col items-center gap-10 mt-10'>
            <div className='flex flex-col items-center gap-2'>
                <Avatar icon="pi pi-user" size="xlarge" shape="circle"/>
                <span className='font-bold'>{user.raw_meta_data.display_name}</span>
                <span className='text-sm'>Membre depuis {memberSince}</span>
            </div>
            <div>
                <span>Annonces en ligne</span>
            </div>
        </div>
    )
}