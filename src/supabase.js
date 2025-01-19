import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://oatzrwezibkcabfwxppo.supabase.co', import.meta.env.VITE_ANON)

export async function addMessage(userMessage, aiMessage){
  const {error} = await supabase
  .from("ai_chats")
  .insert([{
    'sender': "user",
    'message': userMessage,
  },
  {
    'sender': 'ai',
    'message': aiMessage
  }
])
  if(error){
    console.error(error);
  }

}