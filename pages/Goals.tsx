import React, { useState, useMemo } from 'react';
import GoalCircle from '../components/GoalCircle';
import SpendingBarChart from '../components/SpendingBarChart';
import { BUDGET_CATEGORIES } from '../constants';
import { SavingsGoal } from '../types';

const GOAL_ICONS = [
  'emergency_home', 'flight_takeoff', 'directions_car', 'home', 'school',
  'medical_services', 'card_giftcard', 'celebration', 'laptop_mac', 'fitness_center'
];

const GOAL_COLORS = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Sky', hex: '#0ea5e9' },
  { name: 'Orange', hex: '#f97316' },
];

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: '1', title: 'Emergency Fund', saved: 8500, target: 10000, icon: 'emergency_home', color: '#4f46e5', linkedCategoryIds: ['4'] },
    { id: '2', title: 'Summer Vacation', saved: 2000, target: 5000, icon: 'flight_takeoff', color: '#f97316', linkedCategoryIds: [] },
    { id: '3', title: 'New Car', saved: 5000, target: 25000, icon: 'directions_car', color: '#10b981', linkedCategoryIds: [] },
    { id: '4', title: 'Home Fund', saved: 8000, target: 80000, icon: 'home', color: '#f59e0b', linkedCategoryIds: ['1', '2'] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    saved: '0',
    icon: 'flag',
    color: '#4f46e5',
    linkedCategoryIds: [] as string[]
  });

  const handleOpenAddModal = () => {
    setEditingGoalId(null);
    setNewGoal({ title: '', target: '', saved: '0', icon: 'flag', color: '#4f46e5', linkedCategoryIds: [] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: SavingsGoal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      title: goal.title,
      target: goal.target.toString(),
      saved: goal.saved.toString(),
      icon: goal.icon,
      color: goal.color,
      linkedCategoryIds: goal.linkedCategoryIds || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to remove this financial milestone?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target) return;

    if (editingGoalId) {
      setGoals(prev => prev.map(g => g.id === editingGoalId ? {
        ...g,
        title: newGoal.title,
        target: parseFloat(newGoal.target),
        saved: parseFloat(newGoal.saved) || 0,
        icon: newGoal.icon,
        color: newGoal.color,
        linkedCategoryIds: newGoal.linkedCategoryIds
      } : g));
    } else {
      const goal: SavingsGoal = {
        id: Math.random().toString(36).substr(2, 9),
        title: newGoal.title,
        target: parseFloat(newGoal.target),
        saved: parseFloat(newGoal.saved) || 0,
        icon: newGoal.icon,
        color: newGoal.color,
        linkedCategoryIds: newGoal.linkedCategoryIds
      };
      setGoals([...goals, goal]);
    }

    setIsModalOpen(false);
    setEditingGoalId(null);
  };

  const toggleCategoryLink = (id: string) => {
    setNewGoal(prev => ({
      ...prev,
      linkedCategoryIds: prev.linkedCategoryIds.includes(id)
        ? prev.linkedCategoryIds.filter(cid => cid !== id)
        : [...prev.linkedCategoryIds, id]
    }));
  };

  const getCategoryNames = (ids?: string[]) => {
    if (!ids) return [];
    return BUDGET_CATEGORIES
      .filter(cat => ids.includes(cat.id))
      .map(cat => cat.name);
  };

  return (
    <div className="p-6 sm:p-12 max-w-[1500px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <h2 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">Milestone Tracking</h2>
          <p className="text-slate-400 text-base font-semibold mt-1">Long-term wealth building and spending benchmarks</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-8 py-4 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_task</span>
          Establish New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          <section className="space-y-8">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Active Benchmarks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {goals.map((goal) => (
                <GoalCircle 
                  key={goal.id} 
                  {...goal} 
                  linkedCategories={getCategoryNames(goal.linkedCategoryIds)} 
                  onEdit={() => handleOpenEditModal(goal)}
                />
              ))}
              {goals.length === 0 && (
                <div className="col-span-full py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-4">flag</span>
                  <p className="text-sm font-bold uppercase tracking-widest">No active milestones recorded</p>
                  <button onClick={handleOpenAddModal} className="mt-4 text-primary text-xs font-black uppercase hover:underline">Get Started</button>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-elevated p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Flow Stability Index</h3>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary shadow-sm"></div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Benchmark</span>
                </div>
              </div>
            </div>
            <SpendingBarChart />
          </section>
        </div>

        <aside className="space-y-10">
          <div className="card-elevated p-10 space-y-8 sticky top-12 bg-white dark:bg-slate-900 rounded-[2.5rem]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl font-light">psychology</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Flow Analysis</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-[2rem] bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 space-y-3">
                <div className="flex items-center gap-3 text-rose-500">
                  <span className="material-symbols-outlined text-xl">warning</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Dining Deviation</p>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-snug tracking-tight">Your dining spend is 24% above benchmark this period.</p>
              </div>

              <div className="p-6 rounded-[2rem] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 space-y-3">
                <div className="flex items-center gap-3 text-emerald-500">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Accelerated Progress</p>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-snug tracking-tight">Emergency fund will reach 100% in 18 days at current rate.</p>
              </div>

              <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-xl">lightbulb</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Segment Suggestion</p>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-snug tracking-tight">We detected recurring Amazon flows that could be optimized.</p>
              </div>
            </div>

            <button className="w-full py-5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary transition-all text-[10px] font-black uppercase tracking-widest">
              Audit Data Stream
            </button>
          </div>
        </aside>
      </div>

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">{editingGoalId ? 'edit_note' : 'flag'}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{editingGoalId ? 'Modify Milestone' : 'Establish Milestone'}</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveGoal} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Goal Label</label>
                  <input 
                    required 
                    type="text" 
                    value={newGoal.title} 
                    onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
                    className="w-full input-precision px-6 py-4 text-sm font-bold" 
                    placeholder="e.g. Dream Wedding" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Amount ($)</label>
                    <input 
                      required 
                      type="number" 
                      value={newGoal.target} 
                      onChange={e => setNewGoal({...newGoal, target: e.target.value})} 
                      className="w-full input-precision px-6 py-4 text-sm font-bold" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Progress ($)</label>
                    <input 
                      required 
                      type="number" 
                      value={newGoal.saved} 
                      onChange={e => setNewGoal({...newGoal, saved: e.target.value})} 
                      className="w-full input-precision px-6 py-4 text-sm font-bold" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Map to Budget Streams</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {BUDGET_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategoryLink(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${newGoal.linkedCategoryIds.includes(cat.id) ? 'bg-primary/10 border-primary shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">{cat.icon}</span>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-black">{cat.parentCategory}</p>
                        </div>
                      </div>
                      <div className={`size-5 rounded-full flex items-center justify-center border ${newGoal.linkedCategoryIds.includes(cat.id) ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {newGoal.linkedCategoryIds.includes(cat.id) && <span className="material-symbols-outlined text-[12px] font-black">check</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Visual Persona</label>
                  <div className="grid grid-cols-5 gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                    {GOAL_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setNewGoal({...newGoal, icon: iconName})}
                        className={`size-10 flex items-center justify-center rounded-lg transition-all ${newGoal.icon === iconName ? 'bg-primary text-white shadow-lg scale-110' : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm'}`}
                      >
                        <span className="material-symbols-outlined text-base">{iconName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Accent Tone</label>
                  <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                    {GOAL_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setNewGoal({...newGoal, color: color.hex})}
                        className={`size-8 rounded-full transition-all ring-offset-2 ring-offset-white dark:ring-offset-slate-900 mx-auto ${newGoal.color === color.hex ? 'ring-2 scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="submit" 
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary-dark active:scale-95 transition-all"
                >
                  {editingGoalId ? 'Save Changes' : 'Initialize Benchmark'}
                </button>
                {editingGoalId && (
                  <button 
                    type="button"
                    onClick={() => handleDeleteGoal(editingGoalId)}
                    className="w-full py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Delete Milestone
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;