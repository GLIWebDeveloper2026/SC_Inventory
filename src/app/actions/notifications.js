'use server'

import { createInsForgeServerClient } from '@/lib/insforge/server'

export async function getNotifications() {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  if (!user_id) return { data: [], error: 'Not authenticated' }
  
  const { data, error } = await insforge.database
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${user_id},user_id.is.null`)
    .order('created_at', { ascending: false })
    
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export async function markAsRead(id) {
  const insforge = await createInsForgeServerClient()
  const { data, error } = await insforge.database
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .select()
    
  if (error) return { data: null, error: error.message }
  return { data: data?.[0], error: null }
}

export async function markAllAsRead() {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  if (!user_id) return { error: 'Not authenticated' }
  
  const { error } = await insforge.database
    .from('notifications')
    .update({ read: true })
    .or(`user_id.eq.${user_id},user_id.is.null`)
    
  if (error) return { error: error.message }
  return { error: null }
}

export async function getUnreadCount() {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user_id = authData?.user?.id
  
  if (!user_id) return 0
  
  const { data, error } = await insforge.database
    .from('notifications')
    .select('id')
    .or(`user_id.eq.${user_id},user_id.is.null`)
    .eq('read', false)
    
  if (error) return 0
  return data?.length || 0
}
