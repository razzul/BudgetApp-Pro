
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_TABLE_DATA = [
  ['1', 'January 2023', 'Rent/Housing', '$1,200.00', 'Paid'],
  ['2', 'January 2023', 'Groceries', '$450.23', 'Pending'],
  ['3', 'January 2023', 'Dining Out', '$85.00', 'Paid'],
  ['4', 'February 2023', 'Internet', '$79.99', 'Paid'],
  ['5', 'February 2023', 'Car Insurance', '$145.00', 'Paid'],
];

const MOCKED_SYNCED_DATA = [
  ['1', 'March 2024', 'SaaS Subscription', '$49.00', 'Confirmed'],
  ['2', 'March 2024', 'Workspace Rent', '$850.00', 'Confirmed'],
  ['3', 'March 2024', 'Marketing Agency', '$2,100.00', 'Pending'],
  ['4', 'March 2024', 'Utility/Electric', '$112.50', 'Confirmed'],
  ['5', 'March 2024', 'Hardware Purchase', '$1,299.00', 'Confirmed'],
];

const DataMapping: React.FC = () => {
  const [syncLogic, setSyncLogic] = useState<'overwrite' | 'append'>('overwrite');
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [tableData, setTableData] = useState(INITIAL_TABLE_DATA);
  const [connectedSheetName, setConnectedSheetName] = useState('2023_Finances.xlsx');

  const handleOpenSheetModal = () => {
    setIsSheetModalOpen(true);
  };

  const handleSheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
      alert('Please enter a valid public Google Sheets URL.');
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);
    
    // Simulate high-end sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setTableData(MOCKED_SYNCED_DATA);
            setConnectedSheetName(sheetUrl.split('/d/')[1]?.substring(0, 15) + '... (Synced)');
            setIsSyncing(false);
            setIsSheetModalOpen(false);
            setSyncProgress(0);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bg-light dark:bg-bg-dark flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
          </Link>
          <h2 className="text-slate-900 dark:text-white text-lg md:text-xl font-extrabold tracking-tight">Sheet Intelligence Mapping</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-base text-emerald-500 animate-pulse fill-1">sync_saved_locally</span>
            <span className="leading-none hidden sm:inline">Active Data Pipeline</span>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1400px] w-full mx-auto flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Spreadsheet Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-elevated overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-900">
                    <span className="material-symbols-outlined text-4xl">table_chart</span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-black text-xl tracking-tight">Sheet Connection</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <a 
                        href={sheetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-500 text-sm font-bold truncate max-w-[200px] hover:text-primary hover:underline flex items-center gap-1 group/link"
                        title="Open source Google Sheet"
                      >
                        {connectedSheetName}
                        <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/link:opacity-100 transition-opacity">open_in_new</span>
                      </a>
                      <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest">Audit Master Tab</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleOpenSheetModal}
                  className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                >
                  Change Sheet
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Preview</h4>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Live Pipeline Stream</span>
                  </div>
                </div>
                
                <div className={`overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl custom-scrollbar transition-all duration-500 ${isSyncing ? 'blur-sm grayscale opacity-50' : ''}`}>
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                      <tr>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 text-center">Audit ID</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 dark:border-slate-800">Column A</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 dark:border-slate-800">Column B</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 dark:border-slate-800">Column C</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 dark:border-slate-800">Column D</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-4 text-slate-400 font-bold bg-slate-50/20 dark:bg-slate-800/10 text-center">{row[0]}</td>
                          <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">{row[1]}</td>
                          <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">{row[2]}</td>
                          <td className="px-5 py-4 whitespace-nowrap font-black text-primary">{row[3]}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${row[4] === 'Paid' || row[4] === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {row[4]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Precision Mapping Insight</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      We detected <strong className="font-bold">Date Patterns</strong> in Column A and <strong className="font-bold">Currency Values</strong> in Column C. Mapping suggestions have been updated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mapping Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-elevated flex flex-col h-full overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <h3 className="text-slate-900 dark:text-white font-black text-xl tracking-tight">Data Logic</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Translate spreadsheet nodes to engine fields</p>
              </div>
              
              <div className="p-8 flex-1 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Timeline Column
                      <span className="material-symbols-outlined text-xs text-slate-300 cursor-help" title="Used to categorize data by time period">help</span>
                    </label>
                    <select className="w-full input-precision py-3.5 px-4 text-sm font-bold appearance-none bg-white dark:bg-slate-800">
                      <option selected>Source Column A (Temporal Data)</option>
                      <option>Source Column B</option>
                      <option>Source Column C</option>
                      <option>Source Column D</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Audit Category
                      <span className="material-symbols-outlined text-xs text-slate-300 cursor-help" title="Determines how expenses are grouped into categories">help</span>
                    </label>
                    <select className="w-full input-precision py-3.5 px-4 text-sm font-bold appearance-none bg-white dark:bg-slate-800">
                      <option>Source Column A</option>
                      <option selected>Source Column B (Descriptor)</option>
                      <option>Source Column C</option>
                      <option>Source Column D</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Flow Magnitude
                      <span className="material-symbols-outlined text-xs text-slate-300 cursor-help" title="The numerical value for the transaction">help</span>
                    </label>
                    <select className="w-full input-precision py-3.5 px-4 text-sm font-bold appearance-none bg-white dark:bg-slate-800">
                      <option>Source Column A</option>
                      <option>Source Column B</option>
                      <option selected>Source Column C (Value Node)</option>
                      <option>Source Column D</option>
                    </select>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sync Strategy</label>
                  <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => setSyncLogic('overwrite')}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${syncLogic === 'overwrite' ? 'bg-white dark:bg-primary shadow-lg text-primary dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Overwrite
                    </button>
                    <button 
                      onClick={() => setSyncLogic('append')}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${syncLogic === 'append' ? 'bg-white dark:bg-primary shadow-lg text-primary dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Append
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic text-center px-4 leading-relaxed">
                    * {syncLogic === 'overwrite' ? 'Replaces local cache with source data on every sync pulse.' : 'Merges new source records with the existing local database.'}
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-95">
                  <span className="material-symbols-outlined text-2xl">sync_alt</span>
                  <span>Initiate Data Sync</span>
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="size-1.5 rounded-full bg-emerald-500"></span>
                  Avg latency: 450ms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Sheet Connection Modal */}
      {isSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/60 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl p-12 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="material-symbols-outlined text-3xl">add_link</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Connect Source</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Integrate with Google Sheets Cloud</p>
                </div>
              </div>
              <button 
                onClick={() => !isSyncing && setIsSheetModalOpen(false)} 
                className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                disabled={isSyncing}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSheetSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Spreadsheet URL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500">link</span>
                  <input 
                    required 
                    type="url" 
                    value={sheetUrl} 
                    onChange={e => setSheetUrl(e.target.value)} 
                    disabled={isSyncing}
                    className="w-full input-precision pl-14 pr-6 py-5 text-sm font-bold placeholder:text-slate-300 disabled:opacity-50" 
                    placeholder="https://docs.google.com/spreadsheets/d/..." 
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  Sheet must be set to "Anyone with the link can view"
                </p>
              </div>

              {isSyncing && (
                <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                      Handshaking with API
                    </span>
                    <span>{syncProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="submit" 
                  disabled={isSyncing}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? 'Synchronizing Pipeline...' : 'Connect & Fetch Data'}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Secure OAuth 2.0 tunneling active
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMapping;
