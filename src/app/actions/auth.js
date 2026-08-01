'use server'

import { cookies } from 'next/headers'
import { createAuthActions } from '@insforge/sdk/ssr'
import { createInsForgeServerClient, createInsForgeAdminClient } from '@/lib/insforge/server'

export async function signIn(email, password) {
  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.signInWithPassword({ email, password })
  
  if (error) {
    return { error: error.message || 'Login gagal' }
  }

  // Update last_login in users table
  if (data?.user) {
    const insforge = await createInsForgeServerClient()
    await insforge.database
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)
  }

  return { user: data?.user ?? null }
}

export async function signOut() {
  const auth = createAuthActions({ cookies: await cookies() })
  await auth.signOut()
  return { success: true }
}

export async function signUp({ name, email, password, role_id, phone }) {
  try {
    if (!email || !password || !name) {
      return { error: 'Nama, email, dan password wajib diisi' }
    }
    if (password.length < 6) {
      return { error: 'Password minimal 6 karakter' }
    }

    const admin = createInsForgeAdminClient()
    let userId = null

    // 1. Register via admin client
    const { data: authData, error: authError } = await admin.auth.signUp({
      email,
      password,
      name
    })

    if (authError) {
      // If user already exists in auth, look up ID
      if (authError.message?.toLowerCase().includes('already') || authError.message?.toLowerCase().includes('registered')) {
        const { data: existing } = await admin.database
          .from('auth.users')
          .select('id')
          .eq('email', email)
          .single()
        userId = existing?.id
      } else {
        return { error: authError.message || String(authError) }
      }
    } else {
      userId = authData?.user?.id || authData?.id
    }

    if (!userId) {
      return { error: 'Gagal mendaftarkan akun autentikasi di server' }
    }

    // 2. AUTO-CONFIRM: Mark email as verified automatically
    try {
      await admin.database.query(`UPDATE auth.users SET email_verified = true WHERE email = '${email}' OR id = '${userId}'`)
    } catch (e) {
      console.error('Auto-confirm update error:', e)
    }

    // 3. Determine role
    let targetRoleId = role_id
    if (!targetRoleId) {
      const { data: defaultRole } = await admin.database
        .from('roles')
        .select('id')
        .eq('name', 'Admin Gudang')
        .single()
      targetRoleId = defaultRole?.id
    }

    // 4. Upsert user profile into public.users table
    const { error: dbError } = await admin.database.from('users').upsert([{
      id: userId,
      name,
      email,
      phone: phone || null,
      role_id: targetRoleId || null,
      status: 'active'
    }], { onConflict: 'id' })

    if (dbError) {
      console.error('Error inserting user profile:', dbError)
    }

    // 5. Auto sign-in the user
    try {
      const auth = createAuthActions({ cookies: await cookies() })
      const { error: signInErr } = await auth.signInWithPassword({ email, password })
      if (signInErr) {
        console.error('Auto sign-in error:', signInErr)
        return { success: true, message: 'Akun berhasil dibuat! Silakan masuk dengan email dan password Anda.' }
      }
    } catch (signInErr) {
      console.error('Auto sign-in exception:', signInErr)
      return { success: true, message: 'Akun berhasil dibuat! Silakan masuk dengan email dan password Anda.' }
    }

    return { success: true }
  } catch (err) {
    console.error('signUp exception:', err)
    return { error: err?.message || 'Terjadi kesalahan sistem saat mendaftar' }
  }
}

export async function getPublicRoles() {
  try {
    const admin = createInsForgeAdminClient()
    const { data, error } = await admin.database
      .from('roles')
      .select('id, name')
      .order('name', { ascending: true })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function getCurrentUser() {
  try {
    const insforge = await createInsForgeServerClient()
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser()
    
    if (authError || !authData?.user) {
      return { user: null }
    }

    // Get user profile with role
    const { data: profile } = await insforge.database
      .from('users')
      .select('*, roles(*)')
      .eq('id', authData.user.id)
      .single()

    return { 
      user: profile ? { ...authData.user, ...profile, role: profile.roles } : authData.user 
    }
  } catch {
    return { user: null }
  }
}
