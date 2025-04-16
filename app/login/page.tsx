'use client'
import React, { useState } from 'react'
import { translations } from '@/lib/translations'
import { redirect } from 'next/navigation'
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)

    const handleToggleForm = () => {
        setIsLogin(!isLogin)
    }

    return (
        <div className="flex items-center justify-center mt-5">
            <div className="flex flex-col max-w-3xl w-full">
                <h1 className="text-xl font-bold text-center mb-4">
                    {isLogin ? 'Connectez-vous' : 'Créez un compte'}
                </h1>
                {isLogin ? (
                    <LoginForm onSuccess={() => redirect('/dashboard')}/>
                ) : (
                    <RegisterForm onSuccess={() => redirect('/dashboard')}/>
                )}
                <span
                    className="cursor-pointer mt-4 block text-center text-xs"
                    onClick={handleToggleForm}
                >
                    {isLogin
                        ? translations.login.register
                        : translations.register.login}
                </span>
            </div>
        </div>
    )
}