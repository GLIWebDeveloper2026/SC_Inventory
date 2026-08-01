'use server'

import { createInsForgeServerClient, createInsForgeAdminClient } from '@/lib/insforge/server'

export async function getUsers(search = '', roleId = '') {
  const insforge = await createInsForgeServerClient()
  let query = insforge.database
    .from('users')
    .select('*, roles(name)')
    .order('created_at', { ascending: false })
  
  if (roleId) query = query.eq('role_id', roleId)
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  
  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function getUser(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('users')
    .select('*, roles(name)')
    .eq('id', id)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function createUser(userData) {
  // Validate required fields
  if (!userData.email || !userData.password || !userData.name) {
    return { data: null, error: 'Email, password, dan nama wajib diisi' }
  }
  if (userData.password.length < 6) {
    return { data: null, error: 'Password minimal 6 karakter' }
  }

  const roleId = userData.role_id || userData.roleId
  if (!roleId) {
    return { data: null, error: 'Role wajib dipilih' }
  }

  const admin = createInsForgeAdminClient()
  
  // Sign up the user via admin client
  const { data: authData, error: authError } = await admin.auth.signUp({
    email: userData.email,
    password: userData.password,
    name: userData.name
  })
  
  if (authError) return { data: null, error: authError.message }
  
  // Get the user ID
  let userId = authData?.user?.id || authData?.id
  if (!userId) {
    return { data: null, error: 'Gagal mendaftarkan akun autentikasi' }
  }

  // Auto-confirm: mark email as verified automatically
  try {
    await admin.database.query(`UPDATE auth.users SET email_verified = true WHERE email = '${userData.email}' OR id = '${userId}'`)
  } catch (e) {
    console.error('Auto-confirm update error in createUser:', e)
  }
  
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database.from('users').insert([{
    id: userId,
    name: userData.name,
    email: userData.email,
    phone: userData.phone || null,
    role_id: roleId,
    status: 'active'
  }]).select()
  
  if (error) return { data: null, error: error.message }
  
  const { data: currentUser } = await insforge.auth.getCurrentUser()
  await insforge.database.from('audit_logs').insert([{
    user_id: currentUser?.user?.id,
    action: 'CREATE',
    module: 'users',
    detail: `Membuat user: ${userData.name}`
  }])
  
  return { data: data?.[0], error: null }
}

export async function updateUser(id, userData) {
  const insforge = await createInsForgeServerClient()
  
  const updateData = {}
  if (userData.name !== undefined) updateData.name = userData.name
  if (userData.phone !== undefined) updateData.phone = userData.phone
  if (userData.roleId !== undefined) updateData.role_id = userData.roleId
  if (userData.status !== undefined) updateData.status = userData.status
  
  const { data, error } = await insforge.database
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  
  const { data: currentUser } = await insforge.auth.getCurrentUser()
  await insforge.database.from('audit_logs').insert([{
    user_id: currentUser?.user?.id,
    action: 'UPDATE',
    module: 'users',
    detail: `Mengupdate user ID: ${id}`
  }])
  
  return { data: data?.[0], error: null }
}

export async function toggleUserStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
  return await updateUser(id, { status: newStatus })
}

export async function deleteUser(id) {
  return await updateUser(id, { status: 'inactive' })
}

export async function getRoles() {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('roles')
    .select('*')
    .order('name', { ascending: true })
  if (error) {
    console.error('getRoles error:', error.message)
    return { data: [], error: error.message }
  }
  return { data: data || [], error: null }
}
