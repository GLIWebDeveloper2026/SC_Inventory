'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getCategories() {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('categories')
    .select('*')
    .order('name', { ascending: true })
  if (error) {
    console.error('getCategories error:', error.message)
    return { data: [], error: error.message }
  }
  return { data: data || [], error: null }
}

export async function createCategory(categoryData) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('categories')
    .insert([{ name: categoryData.name, color: categoryData.color }])
    .select()
  if (error) return { data: null, error: error.message }
  return { data: data?.[0], error: null }
}
