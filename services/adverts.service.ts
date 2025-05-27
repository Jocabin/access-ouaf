import { createClient } from "@/utils/supabase/client";
import {supabase} from "@/supabase";

export async function createAd(userData: {
  name: string;
  description: string;
  price: number;
  brand: string;
  state: string;
  img: string | null;
  category: number;
}) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: true, msg: "Vous n'êtes pas connecté" };
  }

  if (userError) {
    return { error: true, msg: userError.message };
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

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: userData.name,
      description: userData.description,
      price: userData.price,
      brand: userData.brand,
      state: userData.state,
      img: userData.img,
      slug: slugify(user.user_metadata.display_name + "-" + userData.name),
      user_id: user.id,
    })
    .select();

  if (error) {
    return { error: true, msg: error.message };
  }

  const id = data[0].id;

  const res = await supabase.from("product_categories").insert({
    product_id: id,
    category_id: userData.category,
  });

  if (res.error) {
    return { error: true, msg: res.error.message };
  }

  return { data: data?.[0] ?? null, error: false, msg: "Produit crée avec succès" };
}

export async function updateAdvert(advertId: string, advertData: object) {
  const { data, error } = await supabase
      .from('products')
      .update(advertData)
      .eq('id', advertId)
      .select()

  if (error) {
    console.error("Erreur lors de la modification de l'annonce :", error)
    return { data: null, error }
  }

  return { data: data?.[0] || null, error: null }
}

export async function deleteAdvert(advertId: string) {
  const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', advertId)

  if (error) {
    console.error("Erreur lors de la suppression de l'annonce :", error)
    return { data: null, error }
  }

  return { data: data?.[0] || null, error: null }
}

export async function uploadImages (file: File, advertId: string) {
  const supabase = await createClient()

  const fileName = `${advertId}_${Date.now()}.${file.name.split('.').pop()}`

  const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

  if (error) {
    throw new Error('Erreur upload de l\'image : ' + error.message)
  }

  return data
}

export async function deleteImages (fileName: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
      .from('images')
      .remove([fileName])

  if (error) {
    throw new Error('Erreur delete image : ' + error.message)
  }

  return data
}

export async function updateAdvertDataImg(fileName: string, advertId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
      .from('products')
      .update({ img: fileName })
      .eq('id', advertId)
      .select()


  if (error) {
    throw new Error(error.message)
  }

  return data
}
