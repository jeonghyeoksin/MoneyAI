import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { ApiKeyStatus, getStoredApiKey, setStoredApiKey, validateApiKey, removeStoredApiKey } from '../services/apiKeyService';

interface ApiKeyManagerProps {
  onStatusChange?: (status: ApiKeyStatus) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<ApiKeyStatus>(ApiKeyStatus.MISSING);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const checkInitialKey = async () => {
      const stored = getStoredApiKey();
      const envKey = process.env.GEMINI_API_KEY;
      
      if (stored) {
        setApiKey(stored);
        await handleValidate(stored);
      } else if (envKey) {
        setApiKey(envKey);
        await handleValidate(envKey);
      } else {
        updateStatus(ApiKeyStatus.MISSING);
      }
    };
    checkInitialKey();
  }, []);

  const updateStatus = (newStatus: ApiKeyStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const handleValidate = async (keyToValidate: string) => {
    if (!keyToValidate) {
      updateStatus(ApiKeyStatus.MISSING);
      return;
    }
    setIsValidating(true);
    updateStatus(ApiKeyStatus.VALIDATING);
    
    const isValid = await validateApiKey(keyToValidate);
    if (isValid) {
      updateStatus(ApiKeyStatus.VALID);
    } else {
      updateStatus(ApiKeyStatus.INVALID);
    }
    setIsValidating(false);
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      removeStoredApiKey();
      updateStatus(ApiKeyStatus.MISSING);
      setIsOpen(false);
      return;
    }
    setStoredApiKey(apiKey.trim());
    await handleValidate(apiKey.trim());
    setIsOpen(false);
  };

  const getStatusIcon = () => {
    if (isValidating) return <Loader2 className="w-4 h-4 animate-spin text-amber-500" />;
    switch (status) {
      case ApiKeyStatus.VALID:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case ApiKeyStatus.INVALID:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case ApiKeyStatus.MISSING:
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
      default:
        return <Key className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    if (isValidating) return '검증 중...';
    switch (status) {
      case ApiKeyStatus.VALID:
        return 'API 연결됨';
      case ApiKeyStatus.INVALID:
        return '유효하지 않은 키';
      case ApiKeyStatus.MISSING:
        return 'API 키 필요';
      default:
        return 'API 설정';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
          status === ApiKeyStatus.VALID 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
            : status === ApiKeyStatus.INVALID
            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
        }`}
      >
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Key className="text-amber-500 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Google Gemini API Key</h3>
                <p className="text-xs text-slate-500">Google AI Studio에서 발급받은 API 키를 입력하세요.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all font-mono text-sm"
                />
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 <span className="text-slate-200">팁:</span> 입력한 키는 브라우저 로컬 스토리지에 안전하게 저장됩니다. Vercel 배포 환경에서도 개별적으로 설정하여 사용할 수 있습니다.
                </p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 text-[10px] mt-2 inline-block underline"
                >
                  API 키 발급받기 →
                </a>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 transition-all text-sm font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={isValidating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all text-sm disabled:opacity-50"
                >
                  {isValidating ? '검증 중...' : '저장 및 적용'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
