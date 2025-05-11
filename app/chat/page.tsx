'use client';

import { RealtimeChat } from '@/components/realtime-chat';
import { useMessagesQuery } from '@/hooks/use-messages-query';
import { storeMessages } from '@/lib/store-messages';
import { useEffect, useRef } from 'react';
import { ChatMessage as RealtimeChatMessage } from '@/hooks/use-realtime-chat';
import { ChatMessage as DbChatMessage } from '@/lib/store-messages';
import { useSearchParams } from 'next/navigation';
import { decodeRoomName } from '@/utils/helpers/roomNameEncoder';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');
  const encodedRoom = searchParams.get('roomName');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedMessageIds = useRef(new Set<string>());
  
  const decodedRoomName = encodedRoom ? decodeRoomName(encodedRoom) : undefined;
  
  const { 
    convertedMessages,
    data: originalMessages,
    isLoading, 
    error, 
    user,
    product,
    roomName: computedRoomName
  } = useMessagesQuery({ 
    productId: sku || undefined,
    roomName: decodedRoomName
  });

  useEffect(() => {
    if (originalMessages?.length) {
      originalMessages.forEach(msg => {
        const msgId = msg.id?.toString() || '';
        if (msgId) {
          processedMessageIds.current.add(msgId);
        }
      });
    }
  }, [originalMessages]);
  
  const handleMessage = async (messages: RealtimeChatMessage[]) => {
    if (!messages.length || !computedRoomName || !product || !user) return;
    
    try {
      const latestMessage = messages[messages.length - 1];
      
      if (processedMessageIds.current.has(latestMessage.id)) return;
      
      processedMessageIds.current.add(latestMessage.id);
      
      const isUserSeller = user.id === product.user_id;
      let buyerId = isUserSeller ? '' : user.id;
      let sellerId = isUserSeller ? user.id : product.user_id;
      
      if (isUserSeller) {
        if (originalMessages?.length) {
          buyerId = originalMessages[0].buyer_id;
        } else {
          throw new Error("Impossible de déterminer l'ID de l'acheteur");
        }
      }
      
      const dbMessage: DbChatMessage = {
        buyer_id: buyerId,
        seller_id: sellerId,
        content: latestMessage.content,
        item_id: product.id,
        room_name: computedRoomName,
        sender_id: user.id
      };
      
      await storeMessages(dbMessage);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du message:", err);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error.message}</div>;
  if (!user || !computedRoomName) return <div className="p-8 text-center">Impossible d'accéder au chat</div>;

  return (
    <div className="flex flex-col max-h-screen">
      {product && (
        <div className="sticky top-0 z-20 bg-white border-b py-2 shadow-sm">
          <div className="max-w-[1120px] mx-auto px-4 flex items-center justify-center gap-3">
            {product.img && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${product.img.split(",")[0]}`}
                  alt={`Image de ${product.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-lg font-semibold text-gray-800">{product.name}</h1>
            <span className="text-base font-medium text-[#b3592a]">{product.price}€</span>
          </div>
        </div>
      )}
      
      <div className="min-h-0 grow overflow-y-auto" id="chat-messages-container">
        <div className="max-w-[1120px] mx-auto p-4 pb-0">
          <RealtimeChat 
            roomName={computedRoomName} 
            username={user.user_metadata?.name || user.email}
            onMessage={handleMessage}
            messages={convertedMessages} 
          />
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}