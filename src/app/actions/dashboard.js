'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getDashboardStats() {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('items')
    .select('id, stock, price, min_stock')
    .eq('is_deleted', false)
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},user_id.is.null`)
  }

  const { data: items } = await query
  
  const totalItems = items?.length || 0
  const totalStock = items?.reduce((sum, i) => sum + Number(i.stock), 0) || 0
  const inventoryValue = items?.reduce((sum, i) => sum + (Number(i.stock) * Number(i.price)), 0) || 0
  const lowStockCount = items?.filter(i => Number(i.stock) < Number(i.min_stock)).length || 0
  
  return { totalItems, totalStock, inventoryValue, lowStockCount }
}

export async function getStockMovements(days = 7) {
  const insforge = await createInsForgeServerClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data } = await insforge.database
    .from('stock_movements')
    .select('date, movement_type, qty')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true })
  
  const grouped = {}
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().split('T')[0]
    grouped[key] = { date: key, incoming: 0, outgoing: 0 }
  }
  
  data?.forEach(m => {
    const key = m.date
    if (grouped[key]) {
      if (m.movement_type === 'incoming') grouped[key].incoming += Number(m.qty)
      else if (m.movement_type === 'outgoing') grouped[key].outgoing += Number(m.qty)
    }
  })
  
  return Object.values(grouped)
}

export async function getCategoryDistribution() {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  const { data: categories } = await insforge.database
    .from('categories')
    .select('id, name, color')
  
  let itemQuery = insforge.database
    .from('items')
    .select('category_id')
    .eq('is_deleted', false)

  if (userId) {
    itemQuery = itemQuery.or(`user_id.eq.${userId},user_id.is.null`)
  }

  const { data: items } = await itemQuery
  
  return categories?.map(cat => ({
    ...cat,
    count: items?.filter(i => i.category_id === cat.id).length || 0
  })) || []
}

export async function getLowStockAlerts() {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('items')
    .select('*, categories(name), uoms:base_uom_id(symbol)')
    .eq('is_deleted', false)
    .order('stock', { ascending: true })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},user_id.is.null`)
  }

  const { data } = await query
  
  return data?.filter(i => Number(i.stock) < Number(i.min_stock)) || []
}

export async function getRecentActivity(limit = 10) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id

  let query = insforge.database
    .from('audit_logs')
    .select('*, users(name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userId) {
    query = query.or(`user_id.eq.${userId},user_id.is.null`)
  }

  const { data } = await query
  
  return data || []
}
