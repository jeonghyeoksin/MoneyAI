import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContentGenerator from './components/ContentGenerator';
import VideoCreator from './components/VideoCreator';
import SourcingAssistant from './components/SourcingAssistant';
import ProductPhotographer from './components/ProductPhotographer';
import DetailHookGenerator from './components/DetailHookGenerator';
import DetailPageGenerator from './components/DetailPageGenerator';
import ApiKeyManager from './components/ApiKeyManager';
import { ApiKeyStatus } from './services/apiKeyService';
import { AppView } from './types';
import { Lock, ArrowRight, AlertTriangle, Key } from 'lucide-react';

const AUTH_STORAGE_KEY = 'money_maker_auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [accessKey, setAccessKey] = useState('');
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>(ApiKeyStatus.MISSING);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === '1111') {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      alert('접근키가 올바르지 않습니다.');
      setAccessKey('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-200">
        {/* Decorative Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />

        <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
              <Lock className="text-amber-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Private Access</h1>
            <p className="text-slate-500 text-sm text-center">
              돈버는 클래스 AI 에이전트<br/>접근 권한 확인이 필요합니다.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Access Key"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-center text-lg tracking-[0.3em] text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:tracking-normal placeholder:text-slate-700"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Enter Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-700 uppercase tracking-widest">
              Secured by MoneyMaker AI
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case AppView.TODAY_ITEM:
        return <SourcingAssistant />;
      case AppView.PRODUCT_PHOTO:
        return <ProductPhotographer />;
      case AppView.DETAIL_HOOK:
        return <DetailHookGenerator />;
      case AppView.DETAIL_PAGE:
        return <DetailPageGenerator />;
      case AppView.NEWSLETTER:
        return <ContentGenerator mode="NEWSLETTER" />;
      case AppView.INSTAGRAM:
        return <ContentGenerator mode="INSTA" />;
      case AppView.YOUTUBE_PLAN:
        return <ContentGenerator mode="YOUTUBE" />;
      case AppView.YOUTUBE_VIDEO:
        return <VideoCreator />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-8">
            <ApiKeyManager onStatusChange={setApiKeyStatus} />
          </div>

          {apiKeyStatus !== ApiKeyStatus.VALID ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 shadow-xl">
                {apiKeyStatus === ApiKeyStatus.INVALID ? (
                  <AlertTriangle className="text-red-500 w-10 h-10" />
                ) : (
                  <Key className="text-amber-500 w-10 h-10" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {apiKeyStatus === ApiKeyStatus.INVALID ? '유효하지 않은 API 키' : 'API 키 설정 필요'}
              </h2>
              <p className="text-slate-400 max-w-md mb-8">
                {apiKeyStatus === ApiKeyStatus.INVALID 
                  ? '입력하신 Google Gemini API 키가 유효하지 않거나 권한이 없습니다. 올바른 키를 다시 입력해주세요.' 
                  : '이 서비스를 이용하려면 우측 상단의 버튼을 클릭하여 Google Gemini API 키를 설정해야 합니다.'}
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all text-sm font-medium"
                >
                  API 키 발급 안내
                </a>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
      
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default App;