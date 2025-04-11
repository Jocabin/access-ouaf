// import { RealtimeChat } from '@/components/realtime-chat'
// // import { useMessagesQuery } from '@/hooks/use-messages-query'
// // import { storeMessages } from '@/lib/store-messages'

// export default function ChatPage() {
//   const { data: messages } = useMessagesQuery()
//   const handleMessage = async (messages: ChatMessage[]) => {
//     // Store messages in your database
//     await storeMessages(messages)
//   }

//   return <RealtimeChat roomName="my-chat-room" username="john_doe" onMessage={handleMessage} />
// }

import { RealtimeChat } from '@/components/realtime-chat'
 
export default function ChatPage() {
  return <RealtimeChat roomName="my-chat-room" username="Olivia" />
}