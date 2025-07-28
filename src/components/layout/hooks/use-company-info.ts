import { useState, useEffect } from 'react'
import { Command } from 'lucide-react'
import { companiesApi } from '@/features/companies/lib/companies-service'
import { type CompanyInformation } from '../types'

const defaultCompanyInfo: CompanyInformation = {
  name: 'Codex - Facturación',
  logo: Command,
  plan: 'by Sinergya America S.R.L.',
}

export function useCompanyInfo(empresaId?: number | null): CompanyInformation {
  const [companyInfo, setCompanyInfo] =
    useState<CompanyInformation>(defaultCompanyInfo)

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!empresaId) {
        setCompanyInfo(defaultCompanyInfo)
        return
      }

      try {
        const company = await companiesApi.getById(empresaId)
        setCompanyInfo({
          name: company.nombre || 'Empresa sin nombre',
          logo: Command, // Por ahora usamos el ícono por defecto, se puede mejorar
          plan: company.descripcion || 'Sin descripción',
        })
      } catch (error) {
        console.error('Error fetching company info:', error)
        setCompanyInfo({
          name: 'Error al cargar empresa',
          logo: Command,
          plan: 'Error de conexión',
        })
      }
    }

    fetchCompanyInfo()
  }, [empresaId])

  return companyInfo
}
