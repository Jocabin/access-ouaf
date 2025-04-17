'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { translations } from '@/lib/translations'
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { createClient } from "@/utils/supabase/client"

function LoginPageContent() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(true)
    const [hideToggle, setHideToggle] = useState(false);
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectPath = searchParams.get('redirect') || '/'

    async function checkAuthentication() {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            router.push('/')
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuthentication()
    })

    const handleToggleForm = () => {
        setIsLogin(!isLogin)
    }

    const handleSuccess = () => {
        router.push(redirectPath)
    }

    if (loading) {
        return <div></div>
    }

    return (
        <div className="flex items-center justify-center mt-5">
            <div className="flex flex-col max-w-3xl w-full">
                <h1 className="text-xl font-bold text-center mb-4">
                    {isLogin ? translations.loginPage.titleLogin : translations.loginPage.titleRegister}
                </h1>
                {isLogin ? (
                    <LoginForm onSuccess={handleSuccess} setHideToggle={setHideToggle} />
                ) : (
                    <RegisterForm onSuccess={handleSuccess} />
                )}
                {!hideToggle && (
                    <span
                        className="cursor-pointer mt-4 block text-center text-xs"
                        onClick={handleToggleForm}
                    >
                    {isLogin
                        ? translations.login.register
                        : translations.register.login}
                  </span>
                )}
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div></div>}>
            <LoginPageContent />
        </Suspense>
    )
}