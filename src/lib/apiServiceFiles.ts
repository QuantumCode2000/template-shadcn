/* ============================================================================
   apiServiceFiles.ts  –  requests con FormData / multipart
   ============================================================================ */
import axios, { AxiosRequestConfig, Method } from 'axios'

/*─────────────── 0. Config base ───────────────*/
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const apiFiles = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    // ¡importante! NO incluir 'Content-Type' aquí → axios lo setea solo
    Accept: 'application/json',
  },
})

/*─────────────── 0.1 Interceptor → token Bearer ───────────────*/
apiFiles.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

/*─────────────── 1. Tipo normalizado (igual que en apiService) ───────────────*/
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

/*─────────────── 2. Función genérica ───────────────*/
type Cfg = AxiosRequestConfig

async function request<T>(
  method: Method,
  url: string,
  data?: any,
  config?: Cfg
): Promise<ApiResult<T>> {
  try {
    const resp = await apiFiles.request<{ message?: string; data?: T }>({
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

      /* mismos grupos de error que en apiService */
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

/*─────────────── 3. Métodos públicos ───────────────
   GET/DELETE casi nunca necesitan multipart, pero se incluyen
   para mantener la misma interfaz
────────────────────────────────────────────────────*/
export const get = <T>(url: string, config?: Cfg) =>
  request<T>('GET', url, undefined, config)

export const del = <T>(url: string, config?: Cfg) =>
  request<T>('DELETE', url, undefined, config)

/* POST, PUT, PATCH aceptan FormData directamente */
export const post = <T>(url: string, formData: FormData, config?: Cfg) =>
  request<T>('POST', url, formData, config)

export const put = <T>(url: string, formData: FormData, config?: Cfg) =>
  request<T>('PUT', url, formData, config)

export const patch = <T>(url: string, formData: FormData, config?: Cfg) =>
  request<T>('PATCH', url, formData, config)

export default { get, post, put, patch, del }
