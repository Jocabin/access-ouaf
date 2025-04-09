import { NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

export async function POST(req: Request) {
    try {
        const { id, address, postal_code, city, country } = await req.json()
        console.log(req)
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('addresses')
            .update({
                address: address,
                postal_code: postal_code,
                city: city,
                country: country,
            })
            .eq('auth_id', id)
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Mise à jour réussie', data })
    } catch (err) {
        return NextResponse.json({ error: 'Erreur de mise à jour', err }, { status: 500 })
    }
}