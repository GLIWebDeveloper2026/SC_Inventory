'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getConsignments(search = '', status = '') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('consignments')
    .select('*, users:created_by(name)')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},created_by.eq.${userId},user_id.is.null`)
  }
  if (status) query = query.eq('status', status)
  if (search) query = query.or(`owner_name.ilike.%${search}%`)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getConsignment(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('consignments')
    .select('*, consignment_items(*, items(*, uoms:base_uom_id(symbol))), users:created_by(name)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createConsignment(consignmentData) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  const items = consignmentData.items || []
  
  const { data: consignmentResult, error: consignmentError } = await insforge.database
    .from('consignments')
    .insert([{
      owner_name: consignmentData.ownerName,
      start_date: consignmentData.startDate,
      end_date: consignmentData.endDate || null,
      notes: consignmentData.notes || null,
      status: 'active',
      created_by: user_id,
      user_id: user_id
    }])
    .select()
  
  if (consignmentError) return { data: null, error: consignmentError.message }
  
  const consignment_id = consignmentResult[0].id
  
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      consignment_id: consignment_id,
      item_id: item.itemId,
      received_qty: Number(item.receivedQty)
    }))
    
    const { error: itemsError } = await insforge.database
      .from('consignment_items')
      .insert(itemsToInsert)
      
    if (itemsError) return { data: null, error: itemsError.message }
  }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: user_id,
    action: 'CREATE',
    module: 'consignments',
    detail: `Membuat konsinyasi: ${consignmentData.ownerName}`
  }])
  
  return { data: consignmentResult[0], error: null }
}

export async function updateConsignmentStatus(id, status) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data, error } = await insforge.database
    .from('consignments')
    .update({ status: status })
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'UPDATE',
    module: 'consignments',
    detail: `Mengubah status konsinyasi ID: ${id} menjadi ${status}`
  }])
  
  return { data: data?.[0], error: null }
}
