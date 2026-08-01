'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getReceipts(search = '', status = '') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('receipts')
    .select('*, users:created_by(name)')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},created_by.eq.${userId},user_id.is.null`)
  }
  if (status) query = query.eq('status', status)
  if (search) query = query.or(`receipt_code.ilike.%${search}%,supplier.ilike.%${search}%`)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getReceipt(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('receipts')
    .select('*, receipt_items(*, items(*, uoms:base_uom_id(symbol))), users:created_by(name)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createReceipt(receiptData, status = 'draft') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  let totalAmount = 0
  const items = receiptData.items || []
  items.forEach(item => {
    totalAmount += (Number(item.qty) * Number(item.price))
  })
  
  const { data: receiptResult, error: receiptError } = await insforge.database
    .from('receipts')
    .insert([{
      receipt_code: '',
      supplier: receiptData.supplier,
      date: receiptData.date,
      notes: receiptData.notes || null,
      status: status,
      total: totalAmount,
      created_by: user_id,
      user_id: user_id
    }])
    .select()
  
  if (receiptError) return { data: null, error: receiptError.message }
  
  const receipt_id = receiptResult[0].id
  
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      receipt_id: receipt_id,
      item_id: item.itemId,
      qty: Number(item.qty),
      price: Number(item.price),
      subtotal: Number(item.qty) * Number(item.price)
    }))
    
    const { error: itemsError } = await insforge.database
      .from('receipt_items')
      .insert(itemsToInsert)
      
    if (itemsError) return { data: null, error: itemsError.message }
  }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: user_id,
    action: 'CREATE',
    module: 'receipts',
    detail: `Membuat penerimaan: ${receiptData.supplier}`
  }])
  
  return { data: receiptResult[0], error: null }
}

export async function finalizeReceipt(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data, error } = await insforge.database
    .from('receipts')
    .update({ status: 'final' })
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'FINALIZE',
    module: 'receipts',
    detail: `Menyelesaikan penerimaan ID: ${id}`
  }])
  
  return { data: data?.[0], error: null }
}

export async function deleteReceipt(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data: checkData } = await insforge.database.from('receipts').select('status').eq('id', id).single()
  if (checkData?.status !== 'draft') {
    return { error: 'Only draft receipts can be deleted' }
  }
  
  const { error } = await insforge.database.from('receipts').delete().eq('id', id)
  if (error) return { error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'DELETE',
    module: 'receipts',
    detail: `Menghapus penerimaan ID: ${id}`
  }])
  
  return { error: null }
}
