'use client'
import React, { useRef, useState } from 'react'
import { updatePasswordAction } from '@/app/actions/user/updateUserPassword'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { translations } from '@/lib/translations'
import { Toast } from 'primereact/toast'

export function ResetPassword() {
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast | null>(null)

    const updatePassword = async () => {
        setLoading(true)
        if (password.trim().length < 6) {
            toast.current?.show({
                severity: "error",
                summary: translations.register.errorSummary,
                detail:
                    "Le mot de passe doit contenir au moins 6 caractères et un chiffre.",
            })
            setLoading(false)
            return
        }

        try {
            const response = await updatePasswordAction(password.trim())

            if (response?.user) {
                toast.current?.show({
                    severity: "success",
                    summary: translations.dashboard.accountPage.resetPasswordComponent.successSummary,
                    detail: translations.dashboard.accountPage.resetPasswordComponent.successContent,
                })
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: translations.dashboard.accountPage.resetPasswordComponent.errorSummary,
                    detail: translations.dashboard.accountPage.resetPasswordComponent.errorContent,
                })
                console.error('Erreur de mise à jour:', response)
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: translations.dashboard.accountPage.resetPasswordComponent.errorSummary,
                detail: translations.dashboard.accountPage.resetPasswordComponent.errorContent,
            })
            console.error('Erreur lors de la mise à jour:', err)
        }
        setPassword('')
        setLoading(false)
    }

    return (
        <Card title={ translations.dashboard.accountPage.resetPasswordComponent.cardTitle } className="flex-1">
            <Toast ref={ toast } />
            <div className="p-fluid">
                <div className="p-field flex flex-col gap-2">
                    <label htmlFor="password">{ translations.dashboard.accountPage.resetPasswordComponent.passwordLabel }</label>
                    <InputText
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button
                    type="submit"
                    label={ translations.dashboard.accountPage.resetPasswordComponent.saveButton }
                    className="p-button-warning mt-4"
                    disabled={!password.trim()}
                    loading={loading}
                    onClick={ updatePassword }
                />
            </div>
        </Card>
    )
}

export default ResetPassword