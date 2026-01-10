
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth Delay
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-6 font-display">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="card-elevated p-10 flex flex-col items-center text-center border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
          <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-primary/30">
            <span className="material-symbols-outlined text-4xl font-semibold">account_balance_wallet</span>
          </div>
          
          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Precision Budget</h1>
            <p className="text-slate-500 text-sm font-medium">Financial Intelligence for Professionals</p>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 px-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                {isLoading ? 'Authenticating...' : 'Sign in with Google'}
              </span>
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Secure OAuth Gateway</p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
          By continuing, you agree to the <br/>
          <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Protocol</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
