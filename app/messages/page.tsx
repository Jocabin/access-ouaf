"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { encodeRoomName } from "@/utils/helpers/roomNameEncoder";

interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  user_id: string;
}

interface Conversation {
  roomName: string;
  lastMessage: string;
  lastMessageDate: string;
  product: Product;
  otherUserId: string;
  isUserSeller: boolean;
  unreadCount: number;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadConversations() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Vous devez être connecté pour accéder à vos conversations");
          setLoading(false);
          return;
        }

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (messagesError) {
          console.error("Erreur messages:", messagesError);
          throw messagesError;
        }

        if (!messagesData || messagesData.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        const productIds = [...new Set(messagesData.map((msg) => msg.item_id))];

        let productsData: Product[] = [];
        if (productIds.length > 0) {
          const { data: products, error: productsError } = await supabase
            .from("products")
            .select("id, name, price, img, user_id")
            .in("id", productIds);

          if (productsError) {
            console.error("Erreur produits:", productsError);
            throw productsError;
          }

          productsData = products || [];
        }

        const productsMap: {
          [key: string]: {
            id: string;
            name: string;
            price: number;
            img: string;
            user_id: string;
          };
        } = {};
        productsData.forEach((product) => {
          productsMap[product.id] = product;
        });

        const conversationsMap = new Map();

        for (const message of messagesData) {
          const isUnread = !message.is_read && message.sender_id !== user.id;
          const product = productsMap[message.item_id];
          if (!product) continue;

          const isUserSeller = product.user_id === user.id;
          const otherUserId = isUserSeller
            ? message.buyer_id
            : message.seller_id;

          if (!conversationsMap.has(message.room_name)) {
            conversationsMap.set(message.room_name, {
              roomName: message.room_name,
              lastMessage: message.content,
              lastMessageDate: message.created_at,
              product: product,
              otherUserId: otherUserId,
              isUserSeller: isUserSeller,
              unreadCount: isUnread ? 1 : 0
            });
          } else {
            const existing = conversationsMap.get(message.room_name);
            if (isUnread) {
              existing.unreadCount = (existing.unreadCount || 0) + 1;
            }
            if (
              new Date(message.created_at) > new Date(existing.lastMessageDate)
            ) {
              existing.lastMessage = message.content;
              existing.lastMessageDate = message.created_at;
            }
          }
        }

        const conversationsArray = Array.from(conversationsMap.values());
        conversationsArray.sort(
          (a, b) =>
            new Date(b.lastMessageDate).getTime() -
            new Date(a.lastMessageDate).getTime()
        );

        setConversations(conversationsArray);
      } catch (err) {
        console.error("Erreur lors du chargement des conversations:", err);
        setError("Impossible de charger vos conversations");
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1120px] mx-auto p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mes conversations</h1>

      {conversations.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            Vous n&apos;avez pas encore de conversations
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((convo) => (
            <Link 
              href={`/chat?roomName=${encodeRoomName(convo.roomName)}`} 
              key={convo.roomName}
              className="block no-underline"
            >
              <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16">
                  {convo.product.img && (
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_SUPABASE_URL
                      }/storage/v1/object/public/images/${
                        convo.product.img.split(",")[0]
                      }`}
                      alt={convo.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">{convo.product.name}</h3>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(convo.lastMessageDate), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                  <p className={`text-sm ${convo.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'} truncate mt-1`}>
                    {convo.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-[#b3592a] text-white text-xs rounded-full mr-2">
                        {convo.unreadCount}
                      </span>
                    )}
                    {convo.lastMessage}
                  </p>
                </div>

                <div className="flex-shrink-0 text-[#b3592a] font-bold">
                  {convo.product.price}€
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
