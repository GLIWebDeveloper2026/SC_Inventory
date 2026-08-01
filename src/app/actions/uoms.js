'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getUoms() {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('uoms')
    .select('*')
    .order('name', { ascending: true })
  if (error) {
    console.error('getUoms error:', error.message)
    return { data: [], error: error.message }
  }
  return { data: data || [], error: null }
}

export async function getUomConversions() {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('uom_conversions')
    .select('*, from_uom:from_uom_id(name, symbol), to_uom:to_uom_id(name, symbol)')
  if (error) {
    console.error('getUomConversions error:', error.message)
    return { data: [], error: error.message }
  }
  return { data: data || [], error: null }
}
