'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getStockReport(search = '') {
  const insforge = await createInsForgeServerClient()
  
  let query = insforge.database
    .from('items')
    .select('*, categories(name), uoms:base_uom_id(symbol)')
    .eq('is_deleted', false)
    .order('name', { ascending: true })
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`)
  }
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  
  const reportData = (data || []).map(item => ({
    ...item,
    valuation: Number(item.stock) * Number(item.price)
  }))
  
  return { data: reportData, error: null }
}

export async function getTransactionReport(dateFrom, dateTo, search = '') {
  const insforge = await createInsForgeServerClient()
  
  let query = insforge.database
    .from('stock_movements')
    .select('*, items(name, code)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    
  if (dateFrom) query = query.gte('date', dateFrom)
  if (dateTo) query = query.lte('date', dateTo)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  
  let reportData = data || []
  if (search) {
    reportData = reportData.filter(d => 
      d.items?.name?.toLowerCase().includes(search.toLowerCase()) || 
      d.items?.code?.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  return { data: reportData, error: null }
}

export async function getDiscrepancyReport(dateFrom, dateTo) {
  const insforge = await createInsForgeServerClient()
  
  let query = insforge.database
    .from('stock_opname_details')
    .select('*, stock_opname!inner(date, status), items(name, code)')
    .eq('stock_opname.status', 'completed')
    
  if (dateFrom) query = query.gte('stock_opname.date', dateFrom)
  if (dateTo) query = query.lte('stock_opname.date', dateTo)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  
  const reportData = (data || []).filter(d => Number(d.system_qty) !== Number(d.physical_qty)).map(d => ({
    date: d.stock_opname.date,
    itemName: d.items?.name,
    itemCode: d.items?.code,
    systemQty: d.system_qty,
    physicalQty: d.physical_qty,
    diff: Number(d.physical_qty) - Number(d.system_qty),
    reason: d.reason
  }))
  
  return { data: reportData, error: null }
}
