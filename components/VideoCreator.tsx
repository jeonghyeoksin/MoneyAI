import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';
import { Loader2, Video, Film, AlertCircle, Type } from 'lucide-react';
import FeatureHeader from './common/FeatureHeader';
import { AppView } from '../types';

const VideoCreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [includeSubtitles, setIncludeSubtitles] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setVideoUrl(null);
    setStatus('API 키 확인 중...');
    
    try {
      setStatus('영상 생성 요청 중... (약 1~2분 소요)');
      const url = await generateVideo({
        prompt,
        resolution: '720p',
        aspectRatio,
        includeSubtitles
      });
      if (url) {
        setVideoUrl(url);
        setStatus('완료!');
      } else {
        setStatus('영상 생성에 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
      setStatus('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <FeatureHeader view={AppView.YOUTUBE_VIDEO} title="유튜브 영상 제작" />

      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-blue-200">
            Veo 영상 생성 기능을 사용하기 위해서는 결제가 등록된 Google Cloud 프로젝트의 API 키가 필요합니다. 
            생성 버튼을 누르면 API 키 선택창이 나타날 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">영상 프롬프트</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 미래 도시의 화려한 네온사인 거리, 드론 뷰, 시네마틱 조명, 4k"
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">화면 비율</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      aspectRatio === '16:9' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    16:9 (가로)
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      aspectRatio === '9:16' 
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    9:16 (세로)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">자막 여부</label>
                <button
                  onClick={() => setIncludeSubtitles(!includeSubtitles)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    includeSubtitles 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Type size={16} />
                  {includeSubtitles ? '자막 포함됨' : '자막 없음'}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-amber-900/50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Film size={18} />}
              {loading ? '영상 생성 중...' : '영상 생성 시작'}
            </button>
            
            {status && (
                <div className="text-center text-sm text-slate-400 animate-pulse">
                    {status}
                </div>
            )}
          </div>
        </div>

        <div className="bg-black rounded-2xl border border-slate-800 flex items-center justify-center min-h-[400px] overflow-hidden shadow-2xl">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-contain"
            />
          ) : (
             <div className="text-center text-slate-600 p-8">
              {loading ? (
                 <div className="flex flex-col items-center gap-4">
                   <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
                   <p className="text-slate-300">영상을 렌더링하고 있습니다. 잠시만 기다려주세요.<br/><span className="text-xs text-slate-500">(최대 1~2분 소요될 수 있습니다)</span></p>
                 </div>
              ) : (
                <>
                  <Video size={48} className="mx-auto mb-4 opacity-50" />
                  <p>프롬프트를 입력하여 영상을 생성하세요.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCreator;