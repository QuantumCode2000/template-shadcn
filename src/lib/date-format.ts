// Global date/time formatting utilities
// Uses browser locale; can be enhanced to use company preferences.

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso
    if (isNaN(d.getTime())) return '—'
    return dateTimeFormatter.format(d)
  } catch {
    return String(iso)
  }
}

export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso
    if (isNaN(d.getTime())) return '—'
    return dateFormatter.format(d)
  } catch {
    return String(iso)
  }
}

export function fromNow(iso: string | Date | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso
    const diff = Date.now() - d.getTime()
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return 'hace segundos'
    const min = Math.floor(sec / 60)
    if (min < 60) return `hace ${min} min`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `hace ${hr} h`
    const day = Math.floor(hr / 24)
    return `hace ${day} d`
  } catch {
    return '—'
  }
}
