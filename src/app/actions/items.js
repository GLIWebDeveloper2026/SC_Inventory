'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getItems(search = '', categoryId = '') {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  let query = insforge.database
    .from('items')
    .select('*, categories(id, name, color), uoms:base_uom_id(id, name, symbol)')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.or(`user_id.eq.${userId},user_id.is.null`)
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`)
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getItem(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('items')
    .select('*, categories(id, name, color), uoms:base_uom_id(id, name, symbol)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createItem(itemData) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  
  const { data, error } = await insforge.database
    .from('items')
    .insert([{
      code: itemData.code,
      name: itemData.name,
      category_id: itemData.categoryId,
      base_uom_id: itemData.baseUom,
      stock: Number(itemData.stock) || 0,
      min_stock: Number(itemData.minStock) || 0,
      price: Number(itemData.price) || 0,
      location: itemData.location || null,
      user_id: userId || null
    }])
    .select()
  
  if (error) return { data: null, error: error.message }
  
  // Audit log
  await insforge.database.from('audit_logs').insert([{
    user_id: userId,
    action: 'CREATE',
    module: 'items',
    detail: `Menambahkan barang: ${itemData.name} (${itemData.code})`
  }])
  
  // Record initial stock movement if stock > 0
  if (Number(itemData.stock) > 0 && data?.[0]) {
    await insforge.database.from('stock_movements').insert([{
      date: new Date().toISOString().split('T')[0],
      item_id: data[0].id,
      movement_type: 'incoming',
      qty: Number(itemData.stock),
      reference_type: 'initial_stock'
    }])
  }
  
  return { data: data?.[0], error: null }
}

export async function updateItem(id, itemData) {
  const insforge = await createInsForgeServerClient()
  
  const updateData = {}
  if (itemData.name !== undefined) updateData.name = itemData.name
  if (itemData.code !== undefined) updateData.code = itemData.code
  if (itemData.categoryId !== undefined) updateData.category_id = itemData.categoryId
  if (itemData.baseUom !== undefined) updateData.base_uom_id = itemData.baseUom
  if (itemData.stock !== undefined) updateData.stock = Number(itemData.stock)
  if (itemData.minStock !== undefined) updateData.min_stock = Number(itemData.minStock)
  if (itemData.price !== undefined) updateData.price = Number(itemData.price)
  if (itemData.location !== undefined) updateData.location = itemData.location
  if (itemData.status !== undefined) updateData.status = itemData.status
  
  const { data, error } = await insforge.database
    .from('items')
    .update(updateData)
    .eq('id', id)
    .select()
  
  if (error) return { data: null, error: error.message }
  
  const { data: authData } = await insforge.auth.getCurrentUser()
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'UPDATE',
    module: 'items',
    detail: `Mengupdate barang: ${itemData.name || id}`
  }])
  
  return { data: data?.[0], error: null }
}

export async function deleteItem(id) {
  const insforge = await createInsForgeServerClient()
  
  // Soft delete
  const { error } = await insforge.database
    .from('items')
    .update({ is_deleted: true, status: 'inactive' })
    .eq('id', id)
  
  if (error) return { error: error.message }
  
  const { data: authData } = await insforge.auth.getCurrentUser()
  await insforge.database.from('audit_logs').insert([{
    user_id: authData?.user?.id,
    action: 'DELETE',
    module: 'items',
    detail: `Menghapus barang ID: ${id}`
  }])
  
  return { error: null }
}
