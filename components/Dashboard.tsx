import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { AppView } from '../types';
import { ArrowRight, Sparkles, Quote, ClipboardList, X } from 'lucide-react';
import { PATCH_NOTES } from '../lib/featureMetadata';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  TODAY_ITEM: "데이터 기반 소싱 키워드 DB에서 랜덤으로 아이템을 추천받으세요.",
  PRODUCT_PHOTO: "제품 사진 1장으로 5가지 고퀄리티 컨셉 이미지를 즉시 생성합니다.",
  DETAIL_HOOK: "상품명만 입력하면 상세페이지 도입부를 책임질 3가지 버전의 필승 문구를 만들어드립니다.",
  DETAIL_PAGE: "CRO 전문가의 기획과 Nano Banana Pro 3.0 비주얼 엔진으로 완벽한 상세페이지를 제작합니다.",
  NEWSLETTER: "팬덤을 구축하고 구매 전환율을 높이는 매력적인 뉴스레터를 작성합니다.",
  INSTAGRAM: "저장과 공유를 부르는 카드뉴스 구성과 캡션 전략으로 계정을 빠르게 성장시키세요.",
  YOUTUBE_PLAN: "초반 15초 훅(Hook)부터 아웃트로까지, 알고리즘이 선택하는 영상 구조를 설계합니다.",
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const features = MENU_ITEMS.filter(item => item.id !== 'DASHBOARD');

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      <div className="relative">
        <div className="absolute top-0 right-0 z-20 mt-4 mr-4">
          <button
            onClick={() => setShowPatchNotes(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 rounded-xl transition-all text-sm font-medium shadow-xl hover:text-amber-400"
          >
            <ClipboardList size={18} />
            <span>패치노트</span>
          </button>
        </div>

        {/* Hero Quote Section */}
        <div className="relative py-20 px-6 rounded-3xl overflow-hidden text-center bg-slate-900 border border-slate-800 shadow-2xl group">
           {/* Background effects */}
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.15),transparent_60%)] transition-all duration-700"></div>
           
           <div className="absolute top-10 left-10 opacity-10 animate-pulse"><Quote size={80} className="text-amber-500"/></div>
           <div className="absolute bottom-10 right-10 opacity-10 rotate-180 animate-pulse delay-700"><Quote size={80} className="text-amber-500"/></div>

           <div className="relative z-10 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-amber-200 to-amber-500 leading-tight tracking-tight drop-shadow-sm">
                "아무것도 하지 않으면 <br /> 아무것도 일어나지 않는다"
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                성공을 위한 가장 확실한 방법은 지금 바로 시작하는 것입니다.<br/>
                <span className="text-amber-400 font-semibold">돈버는AI</span>의 강력한 AI도구들이 여러분의 실행을 돕습니다.
              </p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showPatchNotes && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPatchNotes(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl max-h-[80vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-amber-500">
                  <ClipboardList size={24} />
                  <h3 className="text-xl font-bold">패치노트</h3>
                </div>
                <button 
                  onClick={() => setShowPatchNotes(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-100 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {PATCH_NOTES.map((note, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs font-bold border border-amber-500/20">
                        {note.date}
                      </span>
                      <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    <ul className="space-y-2">
                      {note.content.map((item, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-3 text-slate-300">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tools Grid Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
           <div className="p-2 bg-amber-500/10 rounded-lg">
             <Sparkles className="text-amber-500" size={24} />
           </div>
           <h2 className="text-2xl font-bold text-slate-100">Creator Tools</h2>
           <div className="h-px bg-slate-800 flex-1 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as AppView)}
              className="group relative flex flex-col h-full bg-slate-900/40 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-2 overflow-hidden backdrop-blur-sm text-left"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Large Watermark Icon */}
              <div className="absolute -right-6 -bottom-6 opacity-0 group-hover:opacity-5 transition-all duration-500 rotate-[-15deg] transform scale-0 group-hover:scale-150 origin-bottom-right">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 120, className: 'text-white' })}
              </div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-slate-800 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 rounded-2xl flex items-center justify-center transition-all duration-300 border border-slate-700 group-hover:border-transparent shadow-lg group-hover:shadow-amber-900/50">
                   {React.cloneElement(item.icon as React.ReactElement<any>, { 
                    className: 'text-slate-400 group-hover:text-white transition-colors duration-300',
                    size: 28
                  })}
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 group-hover:bg-slate-700 group-hover:text-amber-400">
                  <ArrowRight size={18} />
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors mb-3">
                  {item.label}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {FEATURE_DESCRIPTIONS[item.id]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;