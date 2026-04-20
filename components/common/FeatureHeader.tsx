import React, { useState } from 'react';
import { AppView } from '../../types';
import { FEATURE_METADATA } from '../../lib/featureMetadata';
import { HelpCircle, Coins, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureHeaderProps {
  view: AppView;
  title: string;
}

const FeatureHeader: React.FC<FeatureHeaderProps> = ({ view, title }) => {
  const [showManual, setShowManual] = useState(false);
  const [showCost, setShowCost] = useState(false);
  
  const metadata = FEATURE_METADATA[view];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">{title}</h2>
        <p className="text-slate-400">돈버는AI의 전문 마케팅 전략이 포함된 에디터입니다.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowManual(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 rounded-xl transition-all text-sm font-medium"
        >
          <HelpCircle size={18} className="text-amber-500" />
          사용방법
        </button>
        <button
          onClick={() => setShowCost(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 rounded-xl transition-all text-sm font-medium"
        >
          <Coins size={18} className="text-amber-500" />
          API 비용
        </button>
      </div>

      <AnimatePresence>
        {(showManual || showCost) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowManual(false); setShowCost(false); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[60] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100">
                  {showManual ? '📖 사용방법 가이드' : '💰 API 예상 비용'}
                </h3>
                <button 
                  onClick={() => { setShowManual(false); setShowCost(false); }}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {showManual ? (
                  <div className="text-slate-300 space-y-3 whitespace-pre-wrap leading-relaxed">
                    {metadata?.manual || '가이드 준비 중입니다.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider">추정 비용 (회당)</p>
                        <p className="text-3xl font-extrabold text-amber-500">
                            ₩{metadata?.minCost.toLocaleString()} ~ ₩{metadata?.maxCost.toLocaleString()}
                        </p>
                    </div>
                    <ul className="text-sm text-slate-500 space-y-2 list-disc pl-5">
                        <li>결과물의 길이나 복잡도에 따라 비용이 달라질 수 있습니다.</li>
                        <li>이미지 생성은 모델 종류에 따라 비용 차이가 큽니다.</li>
                        <li>모든 비용은 Google Gemini API 공식 단가(원화 환산) 기준입니다.</li>
                        <li>실제 청구 금액은 환율 및 모델 업데이트에 따라 상이할 수 있음을 표기합니다.</li>
                    </ul>
                  </div>
                )}
                <button 
                  onClick={() => { setShowManual(false); setShowCost(false); }}
                  className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureHeader;
