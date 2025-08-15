// Mock/faker placeholder (similar style to users mock list)
import { faker } from '@faker-js/faker'

export const posMocks = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  codigoSin: i + 100,
  nombre: `POS ${i + 1}`,
  descripcion: faker.commerce.productDescription(),
  tipo: faker.number.int({ min: 1, max: 9 }),
  sucursalId: 1,
  activo: faker.datatype.boolean(),
  createdBy: 1,
  updatedBy: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))
