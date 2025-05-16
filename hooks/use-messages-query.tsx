'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChatMessage, createChatRoomName } from '@/lib/store-messages';
import { ChatMessage as RealtimeChatMessage } from './use-realtime-chat';
import { getUserInfo } from '@/actions/user/getUser';

export function useMessagesQuery(
  options: { roomName?: string; productId?: string | number }
) {
  const { roomName: directRoomName, productId } = options;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [computedRoomName, setComputedRoomName] = useState<string | null>(directRoomName || null);
  const supabase = createClient();
  const [convertedMessages, setConvertedMessages] = useState<RealtimeChatMessage[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  

  useEffect(() => {
    async function loadUserAndProduct() {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!currentUser) {
          throw new Error("Vous devez être connecté pour accéder au chat");
        }
        setUser(currentUser);
        
        if (directRoomName) {
          setComputedRoomName(directRoomName);
          
          const match = directRoomName.match(/chat-.*-item-(\d+)/);
          if (match && match[1]) {
            const extractedItemId = parseInt(match[1]);
            
            const { data: productData, error: productError } = await supabase
              .from("products")
              .select("*")
              .eq("id", extractedItemId)
              .single();
            
            if (productError) throw productError;
            if (!productData) {
              throw new Error("Produit non trouvé");
            }
            
            setProduct(productData);
          }
        }
        else if (productId) {
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();
          
          if (productError) throw productError;
          if (!productData) {
            throw new Error("Produit non trouvé");
          }
          
          setProduct(productData);
          
          const room = createChatRoomName(
            currentUser.id, 
            productData.user_id, 
            typeof productId === 'string' ? parseInt(productId) : productId
          );
          
          setComputedRoomName(room);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize chat'));
        console.error('Error initializing chat:', err);
      }
    }
    
    loadUserAndProduct();
  }, [productId, directRoomName, supabase]);

  useEffect(() => {
    if (!computedRoomName) return;
    
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_name', computedRoomName)
          .order('created_at', { ascending: true });


        if (error) throw error;

        const chatMessages = data.map((msg): ChatMessage => ({
          id: msg.id,
          createdAt: msg.created_at,
          buyer_id: msg.buyer_id,
          seller_id: msg.seller_id,
          content: msg.content,
          item_id: msg.item_id,
          room_name: msg.room_name,
          sender_id: msg.sender_id
        }));

        setMessages(chatMessages);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
        console.error('Error fetching messages:', err);
        setIsLoading(false);
      }
    }

    const subscription = supabase
      .channel(`room:${computedRoomName}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_name=eq.${computedRoomName}`
      }, (payload) => {
        const newMessage: ChatMessage = {
          id: payload.new.id,
          createdAt: payload.new.created_at,
          buyer_id: payload.new.buyer_id,
          seller_id: payload.new.seller_id,
          content: payload.new.content,
          item_id: payload.new.item_id,
          room_name: payload.new.room_name,
          sender_id: payload.new.sender_id
        };
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    fetchMessages();

    return () => {
      subscription.unsubscribe();
    };
  }, [computedRoomName, supabase]);

useEffect(() => {
  if (!messages.length || !user) return;

  const unreadMessages = messages.filter(msg => 
    !msg.is_read && msg.sender_id !== user.id
  );

  if (unreadMessages.length > 0) {
    const messageIds = unreadMessages.map(msg => msg.id);
    
    supabase
      .from('messages')
      .update({ is_read: true })
      .in('id', messageIds)
      .then(({ error }) => {
        if (error) console.error('Erreur de mise à jour:', error);
      });
  }

  let otherUserId = '';
  if (messages.length > 0) {
    otherUserId = messages[0].buyer_id === user.id 
      ? messages[0].seller_id 
      : messages[0].buyer_id;
  }
  
  
  async function loadOtherUser() {
    if (!otherUserId) return;
  
    try {
      const userInfo = await getUserInfo(otherUserId);
      if (userInfo) {
        setOtherUser(userInfo);
      }
    } catch (error) {
      console.error("Erreur appel getUserInfo:", error);
    }
  }
  
  if (otherUserId && !otherUser) {
    loadOtherUser();
  }

  
  const converted = messages.map(msg => {
    const isSentByUser = msg.sender_id === user.id;
    
    return {
      id: msg.id?.toString() || Math.random().toString(),
      createdAt: msg.createdAt 
        ? new Date(msg.createdAt).toISOString() 
        : new Date().toISOString(),
      user: {
        name: isSentByUser 
        ? (user.user_metadata?.name || user.email) 
        : (otherUser?.name || "Autre utilisateur"),
        id: msg.sender_id
      },
      content: msg.content
    };
  });
  
  setConvertedMessages(converted);
}, [messages, user, otherUser]);


  const sendMessage = async (content: string) => {
    if (!user || !computedRoomName) {
      throw new Error("Impossible d'envoyer le message: utilisateur non connecté ou room non définie");
    }
    
    const messageData: Omit<ChatMessage, 'id' | 'createdAt'> = {
      buyer_id: user.id,
      seller_id: product ? product.user_id : "",
      content,
      item_id: typeof productId === 'string' ? parseInt(productId) : (productId as number),
      room_name: computedRoomName,
      sender_id: user.id,
      is_read: false,
    };
    
    const { error } = await supabase.from('messages').insert(messageData);
    
    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

useEffect(() => {
  if (!user || !computedRoomName) return;

  const channel = supabase
    .channel('messages-realtime-status')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_name=eq.${computedRoomName}`
    }, (payload) => {
      const newMessage = payload.new;
      
      if (newMessage.sender_id !== user.id) {
        supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', newMessage.id)
          .then(({ error }) => {
            if (error) console.error('Erreur lors du marquage du message comme lu:', error);
          });
      }
    })
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
}, [computedRoomName, user, supabase]);

  return { 
    data: messages,
    convertedMessages,
    isLoading, 
    error, 
    user,
    product,
    roomName: computedRoomName,
    sendMessage
  };

  
}

