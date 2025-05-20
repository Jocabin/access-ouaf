import { createClient } from "@/utils/supabase/client";

export async function createAd(userData: {
  name: string;
  description: string;
  price: number;
  brand: string;
  state: string;
  img: string;
}) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    return "Vous n'êtes pas connecté";
  }

  if (userError) {
    return userError.message;
  }

  function slugify(text: string): string {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  }

  const { data, error } = await supabase.from("products").insert({
    ...userData,
    slug: slugify(userData.name),
    user_id: user.id,
  });

  if (error) {
    return error.message;
  }

  return data;
}
