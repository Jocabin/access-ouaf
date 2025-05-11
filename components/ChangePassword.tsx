'use client'
import React, { useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { translations } from '@/lib/translations'
import { Toast } from 'primereact/toast'

interface ChangePasswordProps {
    resetMode: boolean
}

export function ChangePassword({ resetMode }: ChangePasswordProps) {
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
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
            const supabase = createClient()
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (!user || userError) {
                toast.current?.show({
                    severity: "error",
                    summary: "Session manquante",
                    detail: "Le lien est expiré ou invalide. Veuillez recommencer la procédure.",
                })
                setLoading(false)
                return
            }
            const { data, error } = await supabase.auth.updateUser({
                password: password.trim()
            })

            if (error) {
                toast.current?.show({
                    severity: "error",
                    summary: translations.dashboard.accountPage.changePasswordComponent.errorSummary,
                    detail: translations.dashboard.accountPage.changePasswordComponent.errorContent,
                })
                console.error('Erreur de mise à jour:', error)
            } else {
                toast.current?.show({
                    severity: "success",
                    summary: translations.dashboard.accountPage.changePasswordComponent.successSummary,
                    detail: translations.dashboard.accountPage.changePasswordComponent.successContent,
                })
                console.log('Mot de passe mis à jour:', data)
                setResetSuccess(true)
            }
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: translations.dashboard.accountPage.changePasswordComponent.errorSummary,
                detail: translations.dashboard.accountPage.changePasswordComponent.errorContent,
            })
            console.error('Erreur lors de la mise à jour:', err)
        }
        setPassword('')
        setLoading(false)
    }

    return (
        <>
            {resetMode ? (
              resetSuccess ? (
                <div className="text-center p-4">
                  <h2 className="text-lg font-semibold mt-5 mb-2">{translations.resetPassword.successTitle}</h2>
                  <p>{translations.resetPassword.successText}</p>
                </div>
              ) : (
                  <div>
                      <div className="flex items-center justify-center mt-5">
                          <div className="flex flex-col max-w-3xl w-full">
                              <h1 className="text-xl font-bold text-center mb-8">
                                  {translations.resetPassword.title}
                              </h1>
                              <span className='mb-4'>{translations.resetPassword.text}</span>
                              <div className="p-fluid">
                                  <div className="p-field flex flex-col gap-2">
                                      <label
                                          htmlFor="password">{translations.dashboard.accountPage.changePasswordComponent.passwordLabel}</label>
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
                                      label={translations.dashboard.accountPage.changePasswordComponent.saveButton}
                                      className="p-button-warning mt-4"
                                      disabled={!password.trim()}
                                      loading={loading}
                                      onClick={updatePassword}
                                  />
                              </div>
                          </div>
                      </div>
                      <Toast ref={toast}/>
                  </div>
              )
            ) : (
                <Card title={translations.dashboard.accountPage.changePasswordComponent.cardTitle} className="flex-1">
                    <Toast ref={toast}/>
                    <div className="p-fluid">
                        <div className="p-field flex flex-col gap-2">
                            <label
                                htmlFor="password">{translations.dashboard.accountPage.changePasswordComponent.passwordLabel}</label>
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
                            label={translations.dashboard.accountPage.changePasswordComponent.saveButton }
                            className="p-button-warning mt-4"
                            disabled={!password.trim()}
                            loading={loading}
                            onClick={ updatePassword }
                        />
                    </div>
                </Card>
            )}
        </>
    )
}

export default ChangePassword