
import React from 'react';
import GoalCircle from '../components/GoalCircle';
import SpendingBarChart from '../components/SpendingBarChart';

const Goals: React.FC = () => {
  return (
    <div className="p-6 sm:p-12 max-w-[1500px] mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <h2 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">Milestone Tracking</h2>
          <p className="text-slate-400 text-base font-semibold mt-1">Long-term wealth building and spending benchmarks</p>
        </div>
        <button className="px-8 py-4 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95">
          Establish New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          <section className="space-y-8">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Active Benchmarks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <GoalCircle title="Emergency Fund" saved={8500} target={10000} />
              <GoalCircle title="Summer Vacation" saved={2000} target={5000} />
              <GoalCircle title="New Car" saved={5000} target={25000} />
              <GoalCircle title="Home Fund" saved={8000} target={80000} />
            </div>
          </section>

          <section className="soft-card p-10 space-y-8">
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
          <div className="soft-card p-10 space-y-8 sticky top-12">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl soft-inner-field flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl font-light">psychology</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Flow Analysis</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-[2rem] bg-accent-pink/5 border border-accent-pink/10 space-y-3">
                <div className="flex items-center gap-3 text-accent-pink">
                  <span className="material-symbols-outlined text-xl">warning</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Dining Deviation</p>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-snug tracking-tight">Your dining spend is 24% above benchmark this period.</p>
              </div>

              <div className="p-6 rounded-[2rem] bg-accent-teal/5 border border-accent-teal/10 space-y-3">
                <div className="flex items-center gap-3 text-accent-teal">
                  <span className="material-symbols-outlined text-xl">bolt</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Accelerated Progress</p>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-snug tracking-tight">Emergency fund will reach 100% in 18 days at current rate.</p>
              </div>

              <div className="p-6 rounded-[2rem] soft-inner-field space-y-3">
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
    </div>
  );
};

export default Goals;
