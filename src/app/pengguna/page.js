'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import CustomSelect from '@/components/ui/CustomSelect';
import { users, roles, getRoleById } from '@/lib/dummy-data';
import styles from './pengguna.module.css';

export default function PenggunaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter ? user.roleId === roleFilter : true;
    return matchSearch && matchRole;
  });

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleAction = (action) => {
    alert(`Fitur ${action} akan tersedia setelah backend terintegrasi`);
  };

  const activeCount = users.filter(u => u.status === 'active').length;
  const inactiveCount = users.filter(u => u.status === 'inactive').length;

  return (
    <>
      <Header title="Manajemen Pengguna" subtitle="Kelola akun pengguna dan hak akses" />
      <div className="pageContent">
        {/* ── Summary Cards ──────────────────────────── */}
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{users.length}</div>
            <div className={styles.summaryLabel}>Total Pengguna</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{activeCount}</div>
            <div className={styles.summaryLabel}>Aktif</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{inactiveCount}</div>
            <div className={styles.summaryLabel}>Nonaktif</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>{roles.length}</div>
            <div className={styles.summaryLabel}>Jumlah Role</div>
          </div>
        </div>

        {/* ── Toolbar ────────────────────────────────── */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Cari pengguna..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CustomSelect
              options={[
                { value: '', label: 'Semua Role' },
                ...roles.map(r => ({ value: r.id, label: r.name }))
              ]}
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
            />
          </div>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Pengguna
          </button>
        </div>

        {/* ── User Cards ─────────────────────────────── */}
        <div className={styles.userGrid}>
          {filteredUsers.map(user => {
            const role = getRoleById(user.roleId);
            return (
              <div key={user.id} className={styles.userCard} onClick={() => setSelectedUser(user)}>
                <div className={styles.avatar} style={{ backgroundColor: role?.color || '#4CAF50' }}>
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                  <div className={styles.userMeta}>
                    <Badge variant="info">{role?.name || 'Unknown'}</Badge>
                    <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <div className={styles.userPhone}>📞 {user.phone}</div>
                  <div className={styles.userLogin}>Login terakhir: {user.lastLogin}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Role Definitions ───────────────────────── */}
        <h3 className={styles.sectionTitle}>Definisi Role</h3>
        <div className={styles.roleGrid}>
          {roles.map(role => (
            <div key={role.id} className={styles.roleCard} style={{ borderLeftColor: role.color }}>
              <div className={styles.roleName}>{role.name}</div>
              <div className={styles.roleDesc}>{role.description}</div>
            </div>
          ))}
        </div>

        {/* ── Detail Modal ───────────────────────────── */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="Detail Pengguna"
          size="md"
        >
          {selectedUser && (() => {
            const role = getRoleById(selectedUser.roleId);
            return (
              <div>
                <div className={styles.detailGrid}>
                  <div>
                    <div className={styles.detailLabel}>Nama Lengkap</div>
                    <div className={styles.detailValue}>{selectedUser.name}</div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Email</div>
                    <div className={styles.detailValue}>{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Nomor Telepon</div>
                    <div className={styles.detailValue}>{selectedUser.phone}</div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Status</div>
                    <div className={styles.detailValue}>
                      <Badge variant={selectedUser.status === 'active' ? 'success' : 'neutral'}>
                        {selectedUser.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Role</div>
                    <div className={styles.detailValue}>{role?.name || '-'}</div>
                  </div>
                  <div>
                    <div className={styles.detailLabel}>Login Terakhir</div>
                    <div className={styles.detailValue}>{selectedUser.lastLogin}</div>
                  </div>
                </div>
                <div className={styles.detailActions}>
                  <button className={styles.btnEdit} onClick={() => handleAction('Edit')}>Edit</button>
                  <button className={styles.btnToggle} onClick={() => handleAction(selectedUser.status === 'active' ? 'Nonaktifkan' : 'Aktifkan')}>
                    {selectedUser.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button className={styles.btnDelete} onClick={() => handleAction('Hapus')}>Hapus</button>
                </div>
              </div>
            );
          })()}
        </Modal>

        {/* ── Add Modal ──────────────────────────────── */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Tambah Pengguna Baru"
          size="md"
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nama Lengkap</label>
            <input type="text" className={styles.formInput} placeholder="Masukkan nama lengkap..." />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input type="email" className={styles.formInput} placeholder="email@gudangtani.id" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nomor Telepon</label>
              <input type="tel" className={styles.formInput} placeholder="08xx-xxxx-xxxx" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Role</label>
              <select className={styles.formInput}>
                <option value="">Pilih role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <select className={styles.formInput}>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input type="password" className={styles.formInput} placeholder="Masukkan password sementara..." />
          </div>
          <div className={styles.formActions}>
            <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
            <button className={styles.btnSave} onClick={() => { handleAction('Simpan'); setShowAddModal(false); }}>Simpan</button>
          </div>
        </Modal>
      </div>
    </>
  );
}
