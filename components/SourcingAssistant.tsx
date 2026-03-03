import React, { useState } from 'react';
import { SOURCING_KEYWORDS } from '../constants';
import { ShoppingBag, Check, Copy, RefreshCw, AlertCircle } from 'lucide-react';

const SourcingAssistant: React.FC = () => {
  const [count, setCount] = useState<number | ''>('');
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleExtract = () => {
    setError('');
    
    if (count === '' || count < 1) {
      setError('1개 이상의 수량을 입력해주세요.');
      return;
    }
    
    if (count > 20) {
      setError('최대 20개까지만 추출할 수 있습니다.');
      return;
    }

    // Shuffle and slice
    const shuffled = [...SOURCING_KEYWORDS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    setResult(selected);
  };

  const copyToClipboard = () => {
    if (result.length === 0) return;
    const text = result.map(keyword => `- ${keyword}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
          오늘 뭐 팔지? <ShoppingBag className="text-amber-500" />
        </h2>
        <p className="text-slate-400">
          검증된 소싱 키워드 데이터베이스에서 무작위 아이템을 추출하여 아이디어를 얻으세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">추출할 개수 (최대 20개)</label>
              <input 
                type="number" 
                value={count}
                onChange={(e) => {
                  const val = e.target.value;
                  setCount(val === '' ? '' : parseInt(val));
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                placeholder="숫자 입력"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <button
              onClick={handleExtract}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-amber-900/50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw size={18} />
              키워드 추출하기
            </button>
          </div>
          
          <div className="text-xs text-slate-500 bg-slate-900 p-4 rounded-lg border border-slate-800 leading-relaxed">
            <strong className="text-slate-400 block mb-1">사용 가이드</strong>
            1. 원하는 키워드 개수(1~20)를 입력하세요.<br/>
            2. 버튼을 누르면 중복 없이 키워드가 추출됩니다.<br/>
            3. 결과는 글머리 기호 형식으로 제공됩니다.
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
            <h3 className="font-bold text-slate-200">추출 결과</h3>
            {result.length > 0 && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '복사됨' : '복사하기'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {result.length > 0 ? (
              <div className="space-y-3 animate-fade-in">
                {result.map((keyword, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-amber-500/30 transition-colors">
                    <span className="text-amber-500 font-bold">-</span>
                    <span className="text-slate-200 text-lg">{keyword}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                <ShoppingBag size={48} />
                <p>개수를 입력하고 키워드를 추출해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcingAssistant;