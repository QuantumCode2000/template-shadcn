import axios, { AxiosRequestConfig, Method } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// 👇 ============== AÑADIR ESTE INTERCEPTOR ============== 👇
api.interceptors.request.use(
  (config) => {
    // Busca el token en el almacenamiento local (o donde lo guardes)
    const token = localStorage.getItem('authToken') // Ajusta 'authToken' al nombre que uses

    // Si el token existe, lo añade a los encabezados de la petición
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Maneja errores de la petición
    return Promise.reject(error)
  }
)
// ============== FIN DEL INTERCEPTOR ==============

/*─────────────── 1. Tipos normalizados ───────────*/
export type ApiResult<T> =
  | { ok: true; status: 200; message: string; data: T }
  | { ok: false; status: 400 | 401 | 402 | 403; message: string }
  | {
      ok: false
      status: 409 | 422
      message: string
      issues?: Record<string, string[]>
    }
  | { ok: false; status: number; message: string }

/*─────────────── 2. Función genérica (sin cambios) ─────────────*/
type Cfg = AxiosRequestConfig

async function request<T>(
  method: Method,
  url: string,
  data?: unknown,
  config?: Cfg
): Promise<ApiResult<T>> {
  // ... tu función request se mantiene exactamente igual
  try {
    const resp = await api.request<{ message?: string; data?: T }>({
      url,
      method,
      data,
      ...config,
    })

    return {
      ok: true,
      status: 200,
      message: resp.data?.message ?? 'OK',
      data: resp.data?.data as T,
    }
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      const { status, data } = err.response

      if ([400, 401, 402, 403].includes(status)) {
        return {
          ok: false,
          status,
          message: data?.message ?? 'Acceso denegado',
        }
      }

      if ([409, 422].includes(status)) {
        return {
          ok: false,
          status,
          message: data?.message ?? 'Datos inválidos',
        }
      }

      return { ok: false, status, message: data?.message ?? 'Error inesperado' }
    }

    return { ok: false, status: -1, message: err.message || 'Sin conexión' }
  }
}

/*─────────────── 3. Métodos públicos (sin cambios) ─────────────*/
export const get = <T>(url: string, config?: Cfg) =>
  request<T>('GET', url, undefined, config)
export const post = <T>(url: string, data?: any, config?: Cfg) =>
  request<T>('POST', url, data, config)
export const put = <T>(url: string, data?: any, config?: Cfg) =>
  request<T>('PUT', url, data, config)
export const patch = <T>(url: string, data?: any, config?: Cfg) =>
  request<T>('PATCH', url, data, config)
export const del = <T>(url: string, config?: Cfg) =>
  request<T>('DELETE', url, undefined, config)

export default { get, post, put, patch, del }
