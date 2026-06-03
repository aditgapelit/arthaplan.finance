# 🎭 Mock Data Setup

Aplikasi ini sudah dikonfigurasi untuk menggunakan **mock data lokal** sebagai pengganti database.

## Akun Test yang Tersedia

### Akun 1
- **Email**: `user@example.com`
- **Password**: `password123`
- **Nama**: John Doe
- **Data**: 7 transaksi, 4 goals

### Akun 2
- **Email**: `demo@arthaplan.com`
- **Password**: `demo123`
- **Nama**: Demo User
- **Data**: 3 transaksi, 1 goal

## Fitur yang Sudah Bekerja dengan Mock Data

✅ **Authentication**
- Login dengan mock data
- Register (email baru akan ditambahkan ke mock users)
- Logout
- Session disimpan di localStorage

✅ **Dashboard**
- Menampilkan data user (nama, saldo)
- Perhitungan total income/expense
- AI Insight berbasis mock data
- Status goals

✅ **Balance Calculation**
- Otomatis menghitung saldo dari transaksi income/expense

## Struktur Mock Data

File: `src/data/mockData.js`

### Mock Users
```javascript
mockUsers = {
  'email@example.com': {
    id: 'user-id',
    email: 'email@example.com',
    password: 'password',
    user_metadata: { full_name: 'Full Name' }
  }
}
```

### Mock Transactions
```javascript
mockTransactions = {
  'user-id': [
    { 
      id, user_id, amount, type ('income'|'expense'), 
      description, date 
    }
  ]
}
```

### Mock Goals
```javascript
mockGoals = {
  'user-id': [
    { 
      id, user_id, name, target_amount, 
      saved_amount, deadline, description 
    }
  ]
}
```

## Cara Menambah Data Mock

### 1. Tambah User Baru
Edit `src/data/mockData.js`:
```javascript
mockUsers['newemail@example.com'] = {
  id: 'user-3',
  email: 'newemail@example.com',
  password: 'password123',
  user_metadata: { full_name: 'New User' }
};
```

### 2. Tambah Transaksi
```javascript
mockTransactions['user-1'].push({
  id: 'trans-id',
  user_id: 'user-1',
  amount: 1500000,
  type: 'expense',
  description: 'Makan di restoran',
  date: '2024-01-20'
});
```

### 3. Tambah Goals
```javascript
mockGoals['user-1'].push({
  id: 'goal-5',
  user_id: 'user-1',
  name: 'Membeli Rumah',
  target_amount: 500000000,
  saved_amount: 100000000,
  deadline: '2025-12-31',
  description: 'Rumah impian di pinggir kota'
});
```

## Transisi ke Database Real

Ketika siap menggunakan database:

1. **Update AuthContext** - Kembalikan ke Supabase auth
2. **Update useBalance** - Fetch dari database
3. **Update Dashboard** - Fetch transactions & goals dari database
4. **Update Components** - Gunakan API endpoints

## Notes

- Data mock disimpan di **memory & localStorage**
- Refresh halaman tetap mempertahankan login (localStorage)
- Data akan reset jika browser cache dihapus
- Tidak ada validasi password yang ketat (untuk testing)
- Semua delay API disimulasikan ~1.5 detik

---

**Happy Testing! 🚀**
