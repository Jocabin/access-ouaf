import { createClient } from "@/utils/supabase/client";

export type ChatMessage = {
  id?: number;
  createdAt?: Date;
  buyer_id: string;
  seller_id: string;
  content: string;
  item_id: number;
  room_name?: string;
  sender_id?: string;
  is_read?: boolean;
};

export async function storeMessages(message: ChatMessage) {
  const supabase = createClient();

  const room_name =
    message.room_name ||
    createChatRoomName(message.buyer_id, message.seller_id, message.item_id);

  const { error } = await supabase.from("messages").insert({
    buyer_id: message.buyer_id,
    seller_id: message.seller_id,
    content: message.content,
    item_id: message.item_id,
    room_name: room_name,
    sender_id: message.sender_id,
  });

  if (error) {
    console.error("Error storing message:", error);
    throw error;
  }
}

export function createChatRoomName(
  userId1: string,
  userId2: string,
  itemId: number
): string {
  const userIds = [userId1, userId2].sort().join("-");
  return `chat-${userIds}-item-${itemId}`;
}
