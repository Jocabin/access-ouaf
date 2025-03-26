import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' })
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) {
        return res.status(401).json({ error: error.message || 'Identifiants invalides' })
      }

      const jwt = data?.session?.access_token
      if (jwt) {
        res.setHeader('Set-Cookie', `jwt=${jwt} HttpOnly Path=/ Max-Age=3600`)
      }

      return res.status(200).json({
        data: {
          user: data?.user,
        },
        message: 'Connexion réussie',
      })
    } catch (err) {
      console.error('Erreur lors de la connexion:', err)
      return res.status(500).json({ error: 'Erreur serveur interne' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${ req.method } Not Allowed`)
  }
}