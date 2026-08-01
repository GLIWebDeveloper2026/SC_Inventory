'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getIssues(search = '', status = '') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('issues')
    .select('*, users:created_by(name)')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},created_by.eq.${userId},user_id.is.null`)
  }
  if (status) query = query.eq('status', status)
  if (search) query = query.or(`issue_code.ilike.%${search}%,destination.ilike.%${search}%`)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getIssue(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('issues')
    .select('*, issue_items(*, items(*, uoms:base_uom_id(symbol))), users:created_by(name)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createIssue(issueData, status = 'draft') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  let totalAmount = 0
  const items = issueData.items || []
  items.forEach(item => {
    totalAmount += (Number(item.qty) * Number(item.price))
  })
  
  const { data: issueResult, error: issueError } = await insforge.database
    .from('issues')
    .insert([{
      issue_code: '',
      destination: issueData.destination,
      date: issueData.date,
      notes: issueData.notes || null,
      status: status,
      total_amount: totalAmount,
      created_by: user_id,
      user_id: user_id
    }])
    .select()
  
  if (issueError) return { data: null, error: issueError.message }
  
  const issue_id = issueResult[0].id
  
  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      issue_id: issue_id,
      item_id: item.itemId,
      qty: Number(item.qty),
      price: Number(item.price),
      subtotal: Number(item.qty) * Number(item.price)
    }))
    
    const { error: itemsError } = await insforge.database
      .from('issue_items')
      .insert(itemsToInsert)
      
    if (itemsError) return { data: null, error: itemsError.message }
  }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: user_id,
    action: 'CREATE',
    module: 'issues',
    detail: `Membuat pengeluaran: ${issueData.destination}`
  }])
  
  return { data: issueResult[0], error: null }
}

export async function finalizeIssue(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data, error } = await insforge.database
    .from('issues')
    .update({ status: 'final' })
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'FINALIZE',
    module: 'issues',
    detail: `Menyelesaikan pengeluaran ID: ${id}`
  }])
  
  return { data: data?.[0], error: null }
}

export async function deleteIssue(id) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  
  const { data: checkData } = await insforge.database.from('issues').select('status').eq('id', id).single()
  if (checkData?.status !== 'draft') {
    return { error: 'Only draft issues can be deleted' }
  }
  
  const { error } = await insforge.database.from('issues').delete().eq('id', id)
  if (error) return { error: error.message }
  
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'DELETE',
    module: 'issues',
    detail: `Menghapus pengeluaran ID: ${id}`
  }])
  
  return { error: null }
}
