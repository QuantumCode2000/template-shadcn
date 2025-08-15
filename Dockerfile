# ---------- Base con Bun ----------
FROM oven/bun:1 AS base

# ---------- Instalación dependencias ----------
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb* bun.lock* pnpm-lock.yaml yarn.lock* ./
# usa bun install; ignora los managers que no existan
RUN bun install --frozen-lockfile

# ---------- Build ----------
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Si usas Vite: ajusta variables de entorno de build si corresponde
ARG VITE_API_URL
ENV VITE_API_URL=https://facturacion.oncoclinicbolivia.com/api/v1
RUN bun run build

# ---------- Runtime ultra liviano ----------
FROM nginx:1.27-alpine AS runner
# Quita archivos default de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia tu build estático
# Para Vite:
COPY --from=build /app/dist/ /usr/share/nginx/html/
# Para CRA (descomenta y comenta la línea anterior):
# COPY --from=build /app/build/ /usr/share/nginx/html/

# Copia configuración nginx custom (ver abajo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]