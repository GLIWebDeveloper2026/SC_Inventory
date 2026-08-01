'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getStockOpnames(status = '') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('stock_opname')
    .select('*, users:auditor_id(name)')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},auditor_id.eq.${userId},user_id.is.null`)
  }
  if (status) query = query.eq('status', status)
  
  const { data, error } = await query
  
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getStockOpname(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('stock_opname')
    .select('*, stock_opname_details(*, items(*, uoms:base_uom_id(symbol))), users:auditor_id(name)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createStockOpname(opnameData) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  const details = opnameData.details || []
  
  const { data: opnameResult, error: opnameError } = await insforge.database
    .from('stock_opname')
    .insert([{
      date: opnameData.date,
      notes: opnameData.notes || null,
      status: 'draft',
      auditor_id: user_id,
      user_id: user_id
    }])
    .select()
  
  if (opnameError) return { data: null, error: opnameError.message }
  
  const opname_id = opnameResult[0].id
  
  if (details.length > 0) {
    const detailsToInsert = details.map(item => ({
      opname_id: opname_id,
      item_id: item.itemId,
      system_qty: Number(item.systemQty),
      physical_qty: Number(item.physicalQty),
      reason: item.reason || null
    }))
    
    const { error: detailsError } = await insforge.database
      .from('stock_opname_details')
      .insert(detailsToInsert)
      
    if (detailsError) return { data: null, error: detailsError.message }
  }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: user_id,
    action: 'CREATE',
    module: 'stock_opname',
    detail: `Membuat stock opname`
  }])
  
  return { data: opnameResult[0], error: null }
}

export async function finalizeStockOpname(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data, error } = await insforge.database
    .from('stock_opname')
    .update({ status: 'completed' })
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'FINALIZE',
    module: 'stock_opname',
    detail: `Menyelesaikan stock opname ID: ${id}`
  }])
  
  return { data: data?.[0], error: null }
}
