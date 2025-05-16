"use server";

import { createClient } from "@supabase/supabase-js";

export async function getUserInfo(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) throw error;

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.display_name || data.user.email,
    };
  } catch (err) {
    console.log("Erreur:", err);
    return null;
  }
}
