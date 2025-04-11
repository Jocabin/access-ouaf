import { useState, useRef } from "react";
import validator from "validator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { translations } from "../lib/translations";
import { createClient } from "@/utils/supabase/client";

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validData = {
        email: validator.normalizeEmail(formData.email, {
          gmail_remove_dots: false,
        }),
        password: formData.password,
      };

      if (validData.email == false) {
        toast.current?.show({
          severity: "error",
          summary: translations.register.errorSummary,
          detail: "Email invalide",
        });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: validData.email,
        password: validData.password,
      });

      if (!error) {
        onSuccess();
        toast.current?.show({
          severity: "success",
          summary: translations.register.successSummary,
          detail: translations.register.successMessage,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: translations.register.errorSummary,
          detail: error.message || translations.register.errorMessage,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: translations.register.errorSummary,
        detail: translations.register.networkError,
      });
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">{translations.login.email}</label>
            <InputText
              type="email"
              id="email"
              name="email"
              className="p-inputtext-sm"
              placeholder={translations.login.placeholder}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">{translations.login.password}</label>
            <InputText
              type="password"
              id="password"
              name="password"
              className="p-inputtext-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="flex justify-center mt-4"
            loading={loading}
          >
            {translations.login.loginButton}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
