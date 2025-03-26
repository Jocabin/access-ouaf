import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        if (req.method === 'POST') {
                const { display_name, email, password, phone, address, postal_code, country, city } = req.body

                if (!display_name || !email || !password) {
                        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' })
                }

                try {
                        const user = await supabase.auth.signUp({
                                email: email,
                                password: password,
                                options: {
                                        data: {
                                                display_name: display_name,
                                                phone: phone || null,
                                        },
                                },
                        })

                        if (user.error) {
                                return res.status(400).json({ error: user.error.message || 'Erreur lors de l\'inscription' })
                        }

                        const userId = user.data?.user?.id

                        const addressData = {
                                auth_id: userId,
                                ...(address ? { address } : {}),
                                ...(postal_code ? { postal_code } : {}),
                                ...(country ? { country } : {}),
                                ...(city ? { city } : {}),
                        }

                        try {
                                const { data, error } = await supabase.from('addresses').insert([addressData])
                                if (error) {
                                        console.error("Supabase insert error :", error)
                                        return res.status(500).json({ error: "Erreur lors de l'insertion dans la base de données", supabaseError: error })
                                }
                                console.log("Supabase insert success :", data)
                                return res.status(201).json({ message: 'Adresse enregistrée avec succès' })
                        } catch (err) {
                                console.error("Error during address insertion :", err)
                                return res.status(500).json({ error: "Erreur serveur interne" })
                        }
                } catch {
                        return res.status(500).json({ error: 'Erreur serveur interne' })
                }
        } else {
                res.setHeader('Allow', ['POST'])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
}