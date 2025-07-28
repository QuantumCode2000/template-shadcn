// lib/users-service.ts
import apiService from '@/lib/apiService'
import { User, NewUser } from '@/features/users/data/schema'

export const usersApi = {
  list: async () => {
    const res = await apiService.get<User[]>('/usuarios')
    if (!res.ok) throw new Error(res.message)
    return res.data.reverse()
  },

  create: async (body: NewUser) => {
    const res = await apiService.post<User>('/usuarios', body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },

  update: async (
    id: string | number,
    body: Partial<User> & { password_confirmation?: string }
  ) => {
    console.log('Updating user with ID:', id)
    const res = await apiService.post<User>(`/users/${id}`, body)
    if (!res.ok) throw new Error(res.message)
    return res.data
  },
}
