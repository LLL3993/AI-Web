import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  timestamp: number
}

export interface ChatRoom {
  id: number | string
  name: string
  // any other fields returned by the backend can be added here
}

export const chatApi = {
  // GET /rooms -> returns list of chat rooms
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await apiClient.get<ChatRoom[]>('/rooms')
    return response.data
  },

  // POST /{roomId}/chat?userPrompt=... -> backend returns a plain string; wrap it in an object
  // so frontend code that expects `response.reply` continues to work.
  doChat: async (roomId: string | number, userPrompt: string): Promise<{ reply: string }> => {
    // Send userPrompt as a request parameter so it maps to @RequestParam on the Java side.
    const response = await apiClient.post<string>(`/${roomId}/chat`, null, {
      params: { userPrompt }
    })
    return { reply: response.data }
  }
}
