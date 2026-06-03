// Mock Users
export const mockUsers = {
  'user@example.com': {
    id: 'user-1',
    email: 'user@example.com',
    password: 'password123',
    user_metadata: {
      full_name: 'John Doe'
    }
  },
  'demo@arthaplan.com': {
    id: 'user-2',
    email: 'demo@arthaplan.com',
    password: 'demo123',
    user_metadata: {
      full_name: 'Demo User'
    }
  }
};

// Mock Transactions
export const mockTransactions = {
  'user-1': [
    { id: '1', user_id: 'user-1', amount: 5000000, type: 'income', description: 'Gaji bulanan', date: '2024-01-01' },
    { id: '2', user_id: 'user-1', amount: 1200000, type: 'expense', description: 'Makan', date: '2024-01-02' },
    { id: '3', user_id: 'user-1', amount: 800000, type: 'expense', description: 'Transport', date: '2024-01-03' },
    { id: '4', user_id: 'user-1', amount: 2000000, type: 'expense', description: 'Cicilan Mobil', date: '2024-01-04' },
    { id: '5', user_id: 'user-1', amount: 500000, type: 'expense', description: 'Belanja Kebutuhan', date: '2024-01-05' },
    { id: '6', user_id: 'user-1', amount: 5000000, type: 'income', description: 'Bonus Kerja', date: '2024-01-10' },
    { id: '7', user_id: 'user-1', amount: 300000, type: 'expense', description: 'Hiburan', date: '2024-01-12' }
  ],
  'user-2': [
    { id: '8', user_id: 'user-2', amount: 4000000, type: 'income', description: 'Gaji', date: '2024-01-01' },
    { id: '9', user_id: 'user-2', amount: 800000, type: 'expense', description: 'Makan', date: '2024-01-02' },
    { id: '10', user_id: 'user-2', amount: 1000000, type: 'expense', description: 'Sewa Rumah', date: '2024-01-03' }
  ]
};

// Mock Goals
export const mockGoals = {
  'user-1': [
    { 
      id: 'goal-1', 
      user_id: 'user-1', 
      name: 'Liburan ke Bali', 
      target_amount: 10000000, 
      saved_amount: 3500000, 
      deadline: '2024-06-30',
      description: 'Liburan keluarga ke Bali selama 1 minggu'
    },
    { 
      id: 'goal-2', 
      user_id: 'user-1', 
      name: 'Beli Motor', 
      target_amount: 20000000, 
      saved_amount: 8000000, 
      deadline: '2024-12-31',
      description: 'Motor impian'
    },
    { 
      id: 'goal-3', 
      user_id: 'user-1', 
      name: 'Dana Darurat', 
      target_amount: 50000000, 
      saved_amount: 25000000, 
      deadline: '2024-12-31',
      description: 'Dana darurat 6 bulan gaji'
    },
    { 
      id: 'goal-4', 
      user_id: 'user-1', 
      name: 'Laptop Baru', 
      target_amount: 15000000, 
      saved_amount: 15000000, 
      deadline: '2024-02-28',
      description: 'Laptop untuk pekerjaan (SELESAI)'
    }
  ],
  'user-2': [
    { 
      id: 'goal-5', 
      user_id: 'user-2', 
      name: 'Investasi Saham', 
      target_amount: 50000000, 
      saved_amount: 10000000, 
      deadline: '2024-12-31',
      description: 'Mulai investasi saham'
    }
  ]
};

// Session storage untuk simulasi logged in user
let currentUser = null;

export const setCurrentUser = (user) => {
  currentUser = user;
};

export const getCurrentUser = () => {
  return currentUser;
};

export const clearCurrentUser = () => {
  currentUser = null;
};
