/**
 * Seed Script: Kategori Barang & Satuan Dasar
 * Konteks: Gudang Koperasi Tani Mekar Jaya (Inventori Pertanian)
 * 
 * Jalankan: node seed-data.mjs
 */

import { createAdminClient } from '@insforge/sdk'

const insforge = createAdminClient({
  baseUrl: 'https://46vtc9zy.us-east.insforge.app',
  apiKey: 'ik_d1dff7d90d556954345ebd20550ec733'
})

// ============================================================
// KATEGORI BARANG - sesuai kebutuhan gudang koperasi tani
// ============================================================
const categories = [
  { name: 'Benih & Bibit', color: '#16a34a' },       // hijau tua - benih padi, jagung, sayur, bibit tanaman
  { name: 'Pupuk Organik', color: '#65a30d' },        // hijau lime - pupuk kompos, kandang, hayati
  { name: 'Pupuk Kimia', color: '#ea580c' },          // oranye tua - urea, NPK, KCl, ZA, SP-36
  { name: 'Pestisida', color: '#dc2626' },            // merah - insektisida, herbisida, fungisida
  { name: 'Obat-obatan Tanaman', color: '#e11d48' },  // rose - ZPT, vitamin tanaman, desinfektan
  { name: 'Alat Pertanian', color: '#2563eb' },       // biru - cangkul, sabit, sprayer, dll
  { name: 'Mesin Pertanian', color: '#4f46e5' },      // indigo - traktor, pompa air, mesin perontok
  { name: 'Hasil Panen', color: '#ca8a04' },          // kuning tua - padi, jagung, kedelai, palawija
  { name: 'Pakan Ternak', color: '#92400e' },         // cokelat - konsentrat, dedak, bungkil
  { name: 'Sarana Irigasi', color: '#0891b2' },       // cyan - pipa, selang, sprinkler, pompa
  { name: 'Karung & Kemasan', color: '#7c3aed' },     // ungu - karung goni, plastik, tali rafia
  { name: 'Bahan Bakar & Pelumas', color: '#475569' } // slate - bensin, solar, oli mesin
]

// ============================================================
// SATUAN DASAR (UOM) - satuan yang umum di gudang pertanian
// ============================================================
const uoms = [
  // Satuan Berat
  { name: 'Kilogram', symbol: 'kg' },
  { name: 'Gram', symbol: 'g' },
  { name: 'Ton', symbol: 'ton' },
  { name: 'Kwintal', symbol: 'kw' },
  { name: 'Ons', symbol: 'ons' },

  // Satuan Volume
  { name: 'Liter', symbol: 'L' },
  { name: 'Mililiter', symbol: 'mL' },

  // Satuan Kemasan
  { name: 'Karung', symbol: 'krg' },
  { name: 'Sak', symbol: 'sak' },
  { name: 'Botol', symbol: 'btl' },
  { name: 'Sachet', symbol: 'sct' },
  { name: 'Jerigen', symbol: 'jrg' },
  { name: 'Dos', symbol: 'dos' },
  { name: 'Pack', symbol: 'pck' },
  { name: 'Bungkus', symbol: 'bks' },
  { name: 'Kaleng', symbol: 'klg' },

  // Satuan Lainnya
  { name: 'Unit', symbol: 'unit' },
  { name: 'Batang', symbol: 'btg' },
  { name: 'Lembar', symbol: 'lbr' },
  { name: 'Meter', symbol: 'm' },
  { name: 'Roll', symbol: 'roll' },
  { name: 'Ikat', symbol: 'ikt' },
  { name: 'Buah', symbol: 'bh' }
]

// ============================================================
// KONVERSI SATUAN
// ============================================================
const uomConversions = [
  // Berat
  { from: 'kg', to: 'g', factor: 1000 },
  { from: 'g', to: 'kg', factor: 0.001 },
  { from: 'ton', to: 'kg', factor: 1000 },
  { from: 'kg', to: 'ton', factor: 0.001 },
  { from: 'kw', to: 'kg', factor: 100 },
  { from: 'kg', to: 'kw', factor: 0.01 },
  { from: 'ons', to: 'g', factor: 100 },
  { from: 'g', to: 'ons', factor: 0.01 },
  { from: 'ton', to: 'kw', factor: 10 },
  { from: 'kw', to: 'ton', factor: 0.1 },
  { from: 'kg', to: 'ons', factor: 10 },
  { from: 'ons', to: 'kg', factor: 0.1 },

  // Volume
  { from: 'L', to: 'mL', factor: 1000 },
  { from: 'mL', to: 'L', factor: 0.001 },

  // Panjang
  { from: 'm', to: 'm', factor: 1 } // base
]

async function seed() {
  console.log('🌱 Memulai seed data Koperasi Tani Mekar Jaya...\n')

  // --- 1. Hapus data lama (urutan penting karena FK) ---
  console.log('🗑️  Membersihkan data lama...')

  await insforge.database.from('uom_conversions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('   ✓ uom_conversions dibersihkan')

  // Items depend on categories and uoms, so we need to check if there are items
  const { data: existingItems } = await insforge.database.from('items').select('id').limit(1)
  if (existingItems && existingItems.length > 0) {
    console.log('   ⚠️  Ada items yang merujuk ke categories/uoms, skip hapus categories & uoms')
    console.log('   ℹ️  Hapus items terlebih dahulu jika ingin reset semua data')
  } else {
    await insforge.database.from('uoms').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('   ✓ uoms dibersihkan')

    await insforge.database.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    console.log('   ✓ categories dibersihkan')
  }

  // --- 2. Insert Kategori ---
  console.log('\n📦 Memasukkan data kategori barang...')
  const { data: insertedCats, error: catError } = await insforge.database
    .from('categories')
    .upsert(categories, { onConflict: 'name' })
    .select()

  if (catError) {
    console.error('   ❌ Gagal insert categories:', catError.message)
    return
  }
  console.log(`   ✅ ${insertedCats.length} kategori berhasil dimasukkan:`)
  insertedCats.forEach(c => console.log(`      • ${c.name} (${c.color})`))

  // --- 3. Insert Satuan Dasar ---
  console.log('\n📏 Memasukkan data satuan dasar (UOM)...')
  const { data: insertedUoms, error: uomError } = await insforge.database
    .from('uoms')
    .insert(uoms)
    .select()

  if (uomError) {
    console.error('   ❌ Gagal insert uoms:', uomError.message)
    return
  }
  console.log(`   ✅ ${insertedUoms.length} satuan berhasil dimasukkan:`)
  insertedUoms.forEach(u => console.log(`      • ${u.name} (${u.symbol})`))

  // --- 4. Insert Konversi Satuan ---
  console.log('\n🔄 Memasukkan konversi satuan...')
  const uomMap = {}
  insertedUoms.forEach(u => { uomMap[u.symbol] = u.id })

  const conversionRows = uomConversions
    .filter(c => uomMap[c.from] && uomMap[c.to])
    .map(c => ({
      from_uom_id: uomMap[c.from],
      to_uom_id: uomMap[c.to],
      factor: c.factor
    }))

  const { data: insertedConvs, error: convError } = await insforge.database
    .from('uom_conversions')
    .insert(conversionRows)
    .select()

  if (convError) {
    console.error('   ❌ Gagal insert konversi:', convError.message)
    return
  }
  console.log(`   ✅ ${insertedConvs.length} konversi satuan berhasil dimasukkan`)

  // --- Summary ---
  console.log('\n' + '='.repeat(50))
  console.log('🎉 SEED DATA BERHASIL!')
  console.log('='.repeat(50))
  console.log(`   📦 Kategori Barang : ${insertedCats.length} data`)
  console.log(`   📏 Satuan Dasar    : ${insertedUoms.length} data`)
  console.log(`   🔄 Konversi Satuan : ${insertedConvs.length} data`)
  console.log('='.repeat(50))
}

seed().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
