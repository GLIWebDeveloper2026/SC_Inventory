'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getReturns(search = '', status = '') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('returns')
    .select('*, users:created_by(name)')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},created_by.eq.${userId},user_id.is.null`)
  }
  if (status) query = query.eq('status', status)
  if (search) query = query.or(`return_code.ilike.%${search}%,party.ilike.%${search}%`)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getReturn(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('returns')
    .select('*, return_items(*, items(*, uoms:base_uom_id(symbol))), users:created_by(name)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createReturn(returnData, status = 'draft') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  const items = returnData.items || []
  
  const { data: returnResult, error: returnError } = await insforge.database
    .from('returns')
    .insert([{
      return_code: '',
      party: returnData.party,
      type: returnData.type,
      reason: returnData.reason || null,
      date: returnData.date,
      notes: returnData.notes || null,
      status: status,
      created_by: user_id,
      user_id: user_id
    }])
    .select()
  
  if (returnError) return { data: null, error: returnError.message }
  
  const return_id = returnResult[0].id
  
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      return_id: return_id,
      item_id: item.itemId,
      qty: Number(item.qty)
    }))
    
    const { error: itemsError } = await insforge.database
      .from('return_items')
      .insert(itemsToInsert)
      
    if (itemsError) return { data: null, error: itemsError.message }
  }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: user_id,
    action: 'CREATE',
    module: 'returns',
    detail: `Membuat retur: ${returnData.party}`
  }])
  
  return { data: returnResult[0], error: null }
}

export async function finalizeReturn(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data, error } = await insforge.database
    .from('returns')
    .update({ status: 'final' })
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'FINALIZE',
    module: 'returns',
    detail: `Menyelesaikan retur ID: ${id}`
  }])
  
  return { data: data?.[0], error: null }
}

export async function deleteReturn(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data: checkData } = await insforge.database.from('returns').select('status').eq('id', id).single()
  if (checkData?.status !== 'draft') {
    return { error: 'Only draft returns can be deleted' }
  }
  
  const { error } = await insforge.database.from('returns').delete().eq('id', id)
  if (error) return { error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'DELETE',
    module: 'returns',
    detail: `Menghapus retur ID: ${id}`
  }])
  
  return { error: null }
}
