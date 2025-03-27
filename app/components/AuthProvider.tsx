'use client'
import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react'
import { supabase } from '@/utils/supabaseClient'

interface AuthContextType {
    user: never
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
    jwt?: string
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children, jwt }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async (jwt) => {
        if (jwt) {
            const { data: { user }, error } = await supabase.auth.getUser(jwt)
            if (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error)
            }
            setUser(user ?? null)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUser(jwt)
    }, [jwt])

    const refreshUser = async (jwt) => {
        console.log(jwt)
        await fetchUser(jwt)
    }

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
    }
    return context
}

export default AuthProvider