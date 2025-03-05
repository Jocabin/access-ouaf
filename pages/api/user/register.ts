import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, surname, email, password, phone, address, postal_code, country } = req.body

        if (!email || !password || !name || !surname) {
            return res.status(400).json({ error: 'Some fields are required' })
        }

        try {
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        surname: surname,
                        phone: phone,
                    },
                },
            })

            if (error) {
                return res.status(400).json({ error: error.message })
            }

            const userId = user?.id

            const { error: addressError } = await supabase.from('address').insert([
                {
                    address: address,
                    postal_code: postal_code,
                    country: country,
                    auth_id: userId,
                }
            ])

            if (addressError) {
                return res.status(400).json({ error: addressError.message });
            }

            return res.status(201).json({ message: 'User registered successfully' })
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error', error: err })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
