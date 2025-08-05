// src/lib/jwtUtils.ts
import { jwtDecode } from 'jwt-decode'

export interface DecodedToken {
  id: number
  nombre: string
  apellido: string
  usuario: string
  email: string
  empresaId: number
  rolId: number
  iat: number
  exp: number
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const now = Date.now() / 1000
    if (decoded.exp < now) {
      return null // token expirado
    }
    return decoded
  } catch (error) {
    return null
  }
}
