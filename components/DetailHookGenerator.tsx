import React, { useState } from 'react';
import { generateDetailHooks } from '../services/geminiService';
import { MessageSquareQuote, Loader2, Copy, Check, Wand2, ArrowRight } from 'lucide-react';
import { HookCopyResult, AppView } from '../types';
import FeatureHeader from './common/FeatureHeader';

const DetailHookGenerator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HookCopyResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const data = await generateDetailHooks(productName);
      setResult(data);
    } catch (e) {
      alert("문구 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <FeatureHeader view={AppView.DETAIL_HOOK} title="상세페이지 후킹 문구" />

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <div className="max-w-2xl mx-auto space-y-4">
            <label className="block text-sm font-medium text-slate-300">상품명 입력</label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="예: 초경량 무선 청소기, 프리미엄 소가죽 지갑"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 text-lg text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !productName}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 rounded-lg shadow-lg shadow-amber-900/50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                    {loading ? '분석 중...' : '문구 생성'}
                </button>
            </div>
            <p className="text-xs text-slate-500 text-center">
                * 브랜드명과 제품명을 함께 입력하면 더 정확한 결과가 나옵니다.
            </p>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Card 1: Emotional */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-colors flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
                    <h3 className="font-bold text-slate-200">Ver 1. 감성적 톤</h3>
                </div>
                <span className="text-xs text-slate-500">공감 & 욕망</span>
            </div>
            <div className="p-6 flex-1">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.emotional}</p>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                <button 
                    onClick={() => copyToClipboard(result.emotional, 'emotional')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                    {copiedKey === 'emotional' ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
                    {copiedKey === 'emotional' ? '복사완료' : '문구 복사하기'}
                </button>
            </div>
          </div>

          {/* Card 2: Practical */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-colors flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    <h3 className="font-bold text-slate-200">Ver 2. 실용적 톤</h3>
                </div>
                <span className="text-xs text-slate-500">기능 & 설득</span>
            </div>
            <div className="p-6 flex-1">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.practical}</p>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                <button 
                    onClick={() => copyToClipboard(result.practical, 'practical')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                    {copiedKey === 'practical' ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
                    {copiedKey === 'practical' ? '복사완료' : '문구 복사하기'}
                </button>
            </div>
          </div>

          {/* Card 3: Luxurious */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-colors flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                    <h3 className="font-bold text-slate-200">Ver 3. 고급스러움</h3>
                </div>
                <span className="text-xs text-slate-500">프리미엄 & 가치</span>
            </div>
            <div className="p-6 flex-1">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.luxurious}</p>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                <button 
                    onClick={() => copyToClipboard(result.luxurious, 'luxurious')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                    {copiedKey === 'luxurious' ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
                    {copiedKey === 'luxurious' ? '복사완료' : '문구 복사하기'}
                </button>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 pointer-events-none select-none">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-64 p-6 flex items-center justify-center">
                    <MessageSquareQuote size={48} className="text-slate-700" />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DetailHookGenerator;