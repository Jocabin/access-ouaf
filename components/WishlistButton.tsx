"use client";

import HeartIcon from "@/components/HeartIcon";
import type { Product } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function WishlistButton({ product }: { product: Product }) {
  const toast = useRef<Toast>(null);
  const [isProductInList, set_isProductInList] = useState(false);

  async function checkIfProductIsInWishlist() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("wishlist")
      .select()
      .eq("product_id", product.id)
      .eq("user_uid", user?.id);

    if (data?.length) {
      set_isProductInList(true);
    } else {
      set_isProductInList(false);
    }
  }

  useEffect(() => {
    checkIfProductIsInWishlist();
  });

  async function addProductToWishlist() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail:
          "Vous devez être connecté pour ajouter ce produit à la liste de souhait",
      });
      return;
    }

    if (isProductInList) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", product.id)
        .eq("user_uid", user.id);

      if (error) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: error.message,
        });
        return;
      } else {
        toast.current?.show({
          severity: "success",
          summary: "Information",
          detail: "Produit supprimé de la wishlist",
        });
        set_isProductInList(false);
      }
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert({ product_id: product.id, user_uid: user.id });

      if (error) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: error.message,
        });
        return;
      } else {
        toast.current?.show({
          severity: "success",
          summary: "Information",
          detail: "Produit ajouté à la wishlist",
        });
        set_isProductInList(true);
      }
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <button
        onClick={addProductToWishlist}
        className="bg-[var(--white)] hover:bg-[var(--hover-color)] border-none cursor-pointer rounded-full aspect-square flex justify-center items-center"
      >
        <HeartIcon color={isProductInList ? "#b3592a" : "none"} />
      </button>
    </>
  );
}
