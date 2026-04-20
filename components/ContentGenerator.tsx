import React, { useState } from 'react';
import { generateInstaCarousel, generateYoutubePlan, generateNewsletter } from '../services/geminiService';
import { Loader2, Copy, Check, Wand2, Palette, LayoutGrid, Table, Sun } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import FeatureHeader from './common/FeatureHeader';
import { AppView } from '../types';

type Mode = 'INSTA' | 'YOUTUBE' | 'NEWSLETTER';

interface ContentGeneratorProps {
  mode: Mode;
}

const INSTA_STYLES = [
    { id: 'MONEY_DARK', name: '머니 다크', desc: '검정 배경 + 형광 텍스트', icon: <Palette size={18} /> },
    { id: 'CLEAN_INFO', name: '클린 인포', desc: '화이트/그린 깔끔 정리', icon: <Sun size={18} /> },
    { id: 'DATA_RANK', name: '데이터 랭크', desc: '표/랭킹/통계 중심', icon: <Table size={18} /> },
    { id: 'VISUAL_GRID', name: '비주얼 그리드', desc: '4분할/로고 모음', icon: <LayoutGrid size={18} /> },
];

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ mode }) => {
  const [topic, setTopic] = useState('');
  const [extra1, setExtra1] = useState(''); // Count
  const [selectedStyle, setSelectedStyle] = useState('MONEY_DARK');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getTitle = () => {
    switch(mode) {
      case 'INSTA': return '인스타그램 캐러셀 기획';
      case 'YOUTUBE': return '유튜브 콘텐츠 기획';
      case 'NEWSLETTER': return '뉴스레터 발행';
      default: return '';
    }
  };

  const getView = () => {
    switch(mode) {
      case 'INSTA': return AppView.INSTAGRAM;
      case 'YOUTUBE': return AppView.YOUTUBE_PLAN;
      case 'NEWSLETTER': return AppView.NEWSLETTER;
      default: return AppView.DASHBOARD;
    }
  };
  
  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setResult('');
    try {
      let text = '';
      if (mode === 'INSTA') {
        text = await generateInstaCarousel(topic, Number(extra1) || 7, selectedStyle);
      } else if (mode === 'YOUTUBE') {
        text = await generateYoutubePlan(topic);
      } else if (mode === 'NEWSLETTER') {
        text = await generateNewsletter(topic);
      }
      setResult(text);
    } catch (e) {
      console.error(e);
      setResult('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <FeatureHeader view={getView()} title={getTitle()} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">주제 / 키워드</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 월 100만원 부수입 만들기"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {mode === 'INSTA' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">디자인 스타일 선택</label>
                  <div className="grid grid-cols-2 gap-2">
                      {INSTA_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                                selectedStyle === style.id 
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-sm font-bold">
                                {style.icon} {style.name}
                            </div>
                            <span className="text-[10px] opacity-70 leading-tight">{style.desc}</span>
                          </button>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">슬라이드 수</label>
                  <input 
                    type="number" 
                    value={extra1}
                    onChange={(e) => setExtra1(e.target.value)}
                    placeholder="기본: 7"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none"
                  />
                </div>
              </>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-amber-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
              {loading ? '콘텐츠 생성하기' : '콘텐츠 생성하기'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
            <h3 className="font-bold text-slate-200">생성 결과</h3>
            {result && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '복사됨' : '복사하기'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto prose prose-invert prose-amber max-w-none scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                <p>AI가 수익화 전략을 분석하여 콘텐츠를 생성하고 있습니다...</p>
              </div>
            ) : result ? (
              <ReactMarkdown>{result}</ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <p>왼쪽에서 주제를 입력하고 생성 버튼을 눌러주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;