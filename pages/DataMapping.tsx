
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DataMapping: React.FC = () => {
  const [syncLogic, setSyncLogic] = useState<'overwrite' | 'append'>('overwrite');

  const tableData = [
    ['1', 'January 2023', 'Rent/Housing', '$1,200.00', 'Paid'],
    ['2', 'January 2023', 'Groceries', '$450.23', 'Pending'],
    ['3', 'January 2023', 'Dining Out', '$85.00', 'Paid'],
    ['4', 'February 2023', 'Internet', '$79.99', 'Paid'],
    ['5', 'February 2023', 'Car Insurance', '$145.00', 'Paid'],
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-background-dark flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#f0f3f4] dark:border-white/10 px-4 md:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="flex items-center justify-center text-[#617c89] hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h2 className="text-[#111618] dark:text-white text-lg md:text-xl font-bold tracking-tight">Google Sheets Data Mapping</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-[#617c89] text-xs">
            <span className="material-symbols-outlined text-base">info</span>
            <span className="leading-none hidden sm:inline">Auto-sync enabled</span>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1400px] w-full mx-auto flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column: Spreadsheet Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-white/5 border border-[#dbe2e6] dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#f0f3f4] dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-3xl">table_chart</span>
                  </div>
                  <div>
                    <h3 className="text-[#111618] dark:text-white font-bold text-lg">Sheet Connection</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[#617c89] text-sm font-medium">2023_Finances.xlsx</p>
                      <span className="size-1 bg-[#617c89] rounded-full"></span>
                      <p className="text-[#617c89] text-sm italic">Main Budget Tab</p>
                    </div>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-4 h-10 border border-[#dbe2e6] dark:border-white/20 rounded-lg text-sm font-semibold text-[#111618] dark:text-white hover:bg-[#f0f3f4] dark:hover:bg-white/5 transition-all">
                  Change Sheet
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-[#617c89] uppercase tracking-wider">Raw Spreadsheet Preview</h4>
                  <span className="text-xs text-[#617c89]">Showing first 10 rows</span>
                </div>
                
                <div className="overflow-x-auto border border-[#f0f3f4] dark:border-white/10 rounded-lg custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-[#f8fafc] dark:bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-bold text-[#617c89] uppercase w-16 text-center">Row</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-[#617c89] uppercase border-l border-[#f0f3f4] dark:border-white/10">Column A</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-[#617c89] uppercase border-l border-[#f0f3f4] dark:border-white/10">Column B</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-[#617c89] uppercase border-l border-[#f0f3f4] dark:border-white/10">Column C</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-[#617c89] uppercase border-l border-[#f0f3f4] dark:border-white/10">Column D</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f3f4] dark:divide-white/10 text-sm">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="dark:text-white/80">
                          <td className="px-4 py-3 text-[#617c89] font-medium bg-[#f8fafc] dark:bg-white/5 text-center">{row[0]}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row[1]}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row[2]}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row[3]}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">lightbulb</span>
                    <p className="text-sm text-[#475569] dark:text-blue-200 leading-tight">
                      <strong className="font-bold">Tip:</strong> Ensure your Google Sheet headers are in the first row for the best mapping experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mapping Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-white/5 border border-[#dbe2e6] dark:border-white/10 rounded-xl flex flex-col h-full shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#f0f3f4] dark:border-white/10">
                <h3 className="text-[#111618] dark:text-white font-bold text-lg">Data Mapping</h3>
                <p className="text-[#617c89] text-sm">Assign spreadsheet columns to application fields</p>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#111618] dark:text-white">
                      Month Column
                      <span className="material-symbols-outlined text-base text-[#617c89] cursor-help" title="Used to categorize data by time period">help</span>
                    </label>
                    <select className="w-full h-11 bg-[#f8fafc] dark:bg-white/5 border-[#dbe2e6] dark:border-white/20 rounded-lg text-sm px-4 focus:ring-primary focus:border-primary">
                      <option selected>Sheet Column A (Date/Month)</option>
                      <option>Sheet Column B</option>
                      <option>Sheet Column C</option>
                      <option>Sheet Column D</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#111618] dark:text-white">
                      Category Name
                      <span className="material-symbols-outlined text-base text-[#617c89] cursor-help" title="Determines how expenses are grouped into categories">help</span>
                    </label>
                    <select className="w-full h-11 bg-[#f8fafc] dark:bg-white/5 border-[#dbe2e6] dark:border-white/20 rounded-lg text-sm px-4 focus:ring-primary focus:border-primary">
                      <option>Sheet Column A</option>
                      <option selected>Sheet Column B (Description)</option>
                      <option>Sheet Column C</option>
                      <option>Sheet Column D</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#111618] dark:text-white">
                      Amount/Spending
                      <span className="material-symbols-outlined text-base text-[#617c89] cursor-help" title="The numerical value for the transaction">help</span>
                    </label>
                    <select className="w-full h-11 bg-[#f8fafc] dark:bg-white/5 border-[#dbe2e6] dark:border-white/20 rounded-lg text-sm px-4 focus:ring-primary focus:border-primary">
                      <option>Sheet Column A</option>
                      <option>Sheet Column B</option>
                      <option selected>Sheet Column C (Value)</option>
                      <option>Sheet Column D</option>
                    </select>
                  </div>
                </div>

                <div className="h-[1px] bg-[#f0f3f4] dark:bg-white/10"></div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#111618] dark:text-white">Sync Logic</label>
                  <div className="flex p-1 bg-[#f8fafc] dark:bg-white/5 rounded-lg border border-[#dbe2e6] dark:border-white/10">
                    <button 
                      onClick={() => setSyncLogic('overwrite')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${syncLogic === 'overwrite' ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-[#617c89] hover:text-[#111618]'}`}
                    >
                      Overwrite
                    </button>
                    <button 
                      onClick={() => setSyncLogic('append')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${syncLogic === 'append' ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white' : 'text-[#617c89] hover:text-[#111618]'}`}
                    >
                      Append
                    </button>
                  </div>
                  <p className="text-[11px] text-[#617c89] italic">
                    * {syncLogic === 'overwrite' ? 'Overwrite will replace all existing app data with sheet content on every sync.' : 'Append will add new sheet content to your existing application data.'}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#f8fafc] dark:bg-white/5 border-t border-[#f0f3f4] dark:border-white/10">
                <button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95">
                  <span className="material-symbols-outlined text-xl">sync</span>
                  <span>Save Mapping & Sync</span>
                </button>
                <p className="text-center mt-3 text-xs text-[#617c89]">
                  Setup will take approximately 10-15 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMapping;
