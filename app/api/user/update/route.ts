import { NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

export async function POST(req: Request) {
    try {
        const { name, email, phone} = await req.json()
        const supabase = await createClient()
        const { data, error } = await supabase.auth.updateUser({
            email,
            phone,
            data: {
                display_name: name
            }
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Mise à jour réussie', data })
    } catch (err) {
        return NextResponse.json({ error: 'Erreur de mise à jour', err }, { status: 500 })
    }
}