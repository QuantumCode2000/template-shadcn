import { faker } from '@faker-js/faker'

export const customerMocks = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  codigoDocumentoIdentidadSin: 1,
  numeroDocumentoIdentidad: String(
    faker.number.int({ min: 1000000, max: 99999999 })
  ),
  complemento: null,
  razonSocial: faker.person.lastName(),
  celular: faker.number.int({ min: 70000000, max: 79999999 }).toString(),
  email: faker.internet.email().toLowerCase(),
  createdBy: 1,
  updatedBy: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))
