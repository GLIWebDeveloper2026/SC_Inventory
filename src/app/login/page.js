'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp, getPublicRoles } from '@/app/actions/auth'
import { useAuth } from '@/contexts/AuthContext'
import styles from './page.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  
  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState('')

  const [roles, setRoles] = useState([])
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refreshUser } = useAuth()

  useEffect(() => {
    async function loadRoles() {
      const data = await getPublicRoles()
      setRoles(data || [])
    }
    loadRoles()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      
      if (result.error) {
        setError(result.error)
      } else {
        await refreshUser()
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const result = await signUp({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role_id: regRole
      })

      if (result.error) {
        setError(result.error)
      } else if (result.message) {
        setSuccessMsg(result.message)
        setMode('login')
      } else {
        await refreshUser()
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError(err?.message || 'Gagal mendaftarkan akun baru')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gudang Tani</h1>
          <p className={styles.subtitle}>Sistem Manajemen Inventori</p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabButton} ${mode === 'login' ? styles.activeTab : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            type="button"
          >
            Masuk (Sign In)
          </button>
          <button 
            className={`${styles.tabButton} ${mode === 'register' ? styles.activeTab : ''}`}
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            type="button"
          >
            Buat Akun Baru
          </button>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {successMsg && (
          <div className={styles.success}>
            {successMsg}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Masukkan email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Masukkan password"
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="regName" className={styles.label}>Nama Lengkap</label>
              <input
                id="regName"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className={styles.input}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="regEmail" className={styles.label}>Email</label>
              <input
                id="regEmail"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className={styles.input}
                placeholder="contoh@gudangtani.id"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="regPhone" className={styles.label}>Nomor Telepon (Opsional)</label>
              <input
                id="regPhone"
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className={styles.input}
                placeholder="08xx-xxxx-xxxx"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="regRole" className={styles.label}>Role / Peran</label>
              <select
                id="regRole"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className={styles.input}
              >
                <option value="">Pilih Role (Default: Admin Gudang)</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="regPassword" className={styles.label}>Password</label>
              <input
                id="regPassword"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className={styles.input}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
