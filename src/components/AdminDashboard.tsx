import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  ShieldCheck, 
  LogOut, 
  Search, 
  Trash2, 
  ChevronLeft, 
  Lock,
  Loader2,
  Mail,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  ipAddress: string;
  joinedAt: Timestamp;
}

export const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [customCount, setCustomCount] = useState('5000');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if exists in admins collection
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch (error) {
          console.error("Admin check failed:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'waitlist'), orderBy('joinedAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WaitlistEntry[];
        setEntries(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'waitlist');
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteDoc(doc(db, 'waitlist', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `waitlist/${id}`);
      }
    }
  };

  const filteredEntries = entries.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card p-12 max-w-md w-full border-brand-purple/20">
          <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-brand-purple" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Admin Access Only</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            This area is restricted to authorized VisionBuddy administrators. Please sign in with an admin account.
          </p>
          <Button onClick={handleLogin} className="w-full">
            {user ? "Sign In as Admin" : "Login with Google"}
          </Button>
          {user && !isAdmin && (
               <p className="mt-4 text-xs text-red-400">Your account ({user.email}) does not have admin privileges.</p>
          )}
        </div>
        <a href="/" className="mt-8 text-white/50 hover:text-white flex items-center gap-2 text-sm transition-colors uppercase tracking-[0.2em] font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to Site
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-display font-bold">Waitlist Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 glass-card px-4 py-2 border-white/5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? <img src={user.photoURL} alt="" /> : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold truncate max-w-[120px]">{user?.displayName}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Administrator</p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="glass-card px-6 py-3 flex items-center gap-4 bg-brand-blue/10 border-brand-blue/20">
              <div className="text-xs font-bold text-brand-blue uppercase tracking-widest">Total Entries</div>
              <div className="text-2xl font-display font-bold">{entries.length}</div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                className="w-24 text-center"
                placeholder="5000"
              />
              <Button 
                variant="secondary" 
                onClick={async () => {
                  if (!window.confirm(`Set total waitlist count to ${customCount}?`)) return;
                  try {
                    const statsRef = doc(db, 'stats', 'global');
                    await setDoc(statsRef, { waitlistCount: parseInt(customCount) || 5000 });
                    alert(`Stats updated to ${customCount}!`);
                  } catch (e) {
                    alert("Error updating stats. Check console.");
                    console.error(e);
                  }
                }}
                className="opacity-20 hover:opacity-100"
              >
                Set Counter
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Email Address</th>
                  <th className="px-6 py-5">Network IP</th>
                  <th className="px-6 py-5">Join Time</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors">
                           <UserIcon className="w-4 h-4" />
                         </div>
                         <span className="font-medium">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
                         <Mail className="w-4 h-4" />
                         {entry.email}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="text-xs font-mono text-white/30 truncate max-w-[120px]">
                         {entry.ipAddress || '—'}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-white/30">
                          <Calendar className="w-4 h-4" />
                          {entry.joinedAt?.toDate().toLocaleString() || 'N/A'}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button 
                        onClick={() => handleDelete(entry.id)}
                        className="p-3 hover:bg-red-500/10 rounded-xl transition-all text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100"
                        title="Delete entry"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEntries.length === 0 && (
            <div className="py-20 text-center text-white/30">
               No entries found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
