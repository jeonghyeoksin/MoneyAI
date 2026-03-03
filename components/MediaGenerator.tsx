import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader2, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

const MediaGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);
    try {
      const imgData = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imgData);
    } catch (e) {
      console.error(e);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-100">블로그 이미지 & 썸네일</h2>
        <p className="text-slate-400">클릭률을 높이는 매력적인 이미지를 생성하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">이미지 프롬프트</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 고급스러운 오피스 책상 위에 놓인 노트북과 커피, 따뜻한 조명, 4k 고화질"
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">비율 선택</label>
              <div className="grid grid-cols-3 gap-3">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      aspectRatio === ratio
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {ratio}
                    <span className="block text-xs opacity-70 font-normal">
                      {ratio === '1:1' ? '인스타/썸네일' : ratio === '16:9' ? '블로그/유튜브' : '릴스/쇼츠'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-amber-900/50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? '이미지 생성 중...' : '이미지 생성하기'}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-4 min-h-[400px] relative overflow-hidden group">
          {generatedImage ? (
            <>
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={generatedImage} 
                  download={`moneymaker_ai_${Date.now()}.png`}
                  className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors"
                >
                  <Download size={20} /> 다운로드
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-600">
              {loading ? (
                 <div className="flex flex-col items-center gap-4">
                   <div className="relative">
                     <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
                     <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500" size={24} />
                   </div>
                   <p className="animate-pulse">고품질 이미지를 렌더링 중입니다...</p>
                 </div>
              ) : (
                <>
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>프롬프트를 입력하여 이미지를 생성하세요.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGenerator;