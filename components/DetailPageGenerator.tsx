import React, { useState } from 'react';
import { planDetailPage, generateImage, researchProductInfo } from '../services/geminiService';
import { DetailPageSection } from '../types';
import { FileText, Loader2, Image as ImageIcon, Sparkles, AlertCircle, Wand2, Download, Upload, X, Layers, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DetailPageGenerator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [manualCount, setManualCount] = useState<number>(5);
  
  // Research State
  const [isResearching, setIsResearching] = useState(false);
  
  // Array of 5 slots for reference images (base64 strings)
  const [refImages, setRefImages] = useState<string[]>(Array(5).fill(''));
  
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState<DetailPageSection[]>([]);
  
  const [generatingImages, setGeneratingImages] = useState<Record<number, boolean>>({});
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImages = [...refImages];
        newImages[index] = base64;
        setRefImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
      const newImages = [...refImages];
      newImages[index] = '';
      setRefImages(newImages);
  }

  const handleAutoResearch = async () => {
    if (!productName.trim()) {
        alert("상품명을 먼저 입력해주세요.");
        return;
    }
    setIsResearching(true);
    try {
        const info = await researchProductInfo(productName);
        if (info) {
            setProductInfo(info);
        } else {
            alert("정보를 찾을 수 없습니다. 상품명을 더 구체적으로 입력해보세요.");
        }
    } catch(e) {
        console.error(e);
        alert("분석 중 오류가 발생했습니다.");
    } finally {
        setIsResearching(false);
    }
  };

  const handlePlan = async () => {
    if (!productName || !productInfo) {
        alert("상품명과 상품 정보를 모두 입력해주세요.");
        return;
    }
    
    setIsPlanning(true);
    setPlan([]);
    setGeneratedImages({});
    
    try {
      // Filter out empty slots and extract base64 + mimeType
      const validImages = refImages
        .filter(img => img !== '')
        .map(img => {
          const [header, base64] = img.split(',');
          const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
          return { base64, mimeType };
        });

      const sections = await planDetailPage(productName, productInfo, validImages, mode, manualCount);
      setPlan(sections);
    } catch (e: any) {
      console.error(e);
      alert(`기획안 생성 중 오류가 발생했습니다: ${e.message || '알 수 없는 오류'}`);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleGenerateImage = async (index: number, prompt: string) => {
    setGeneratingImages(prev => ({ ...prev, [index]: true }));
    try {
      // Use the first reference image as the guide for 100% consistency if available
      const refImgData = refImages.find(img => img !== '');
      let refBase64 = undefined;
      let refMimeType = 'image/png';

      if (refImgData) {
        const [header, base64] = refImgData.split(',');
        refBase64 = base64;
        refMimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
      }

      // Use "3:4" as it's the closest vertical ratio to 2:3 supported by the API enum
      const imageUrl = await generateImage(prompt, "3:4", refBase64, refMimeType); 
      if (imageUrl) {
        setGeneratedImages(prev => ({ ...prev, [index]: imageUrl }));
      }
    } catch (e: any) {
      console.error(e);
      alert(`섹션 ${index+1} 이미지 생성 실패: ${e.message || 'API 오류'}`);
    } finally {
      setGeneratingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleGenerateAllImages = async () => {
    if (plan.length === 0) return;
    setIsBulkGenerating(true);
    
    // Process sequentially to avoid rate limits or overwhelming the browser, but effectively "one click" for user
    for (let i = 0; i < plan.length; i++) {
        if (!generatedImages[i]) {
            await handleGenerateImage(i, plan[i].imagePrompt);
        }
    }
    setIsBulkGenerating(false);
  };

  const handleDownloadAll = () => {
    if (Object.keys(generatedImages).length === 0) {
        alert("다운로드할 이미지가 없습니다.");
        return;
    }
    
    let count = 0;
    Object.entries(generatedImages).forEach(([index, url]) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = url as string;
        link.download = `detail_page_section_${Number(index) + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, count * 300); // 300ms delay to prevent browser throttling
      count++;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
          상세페이지 생성 <FileText className="text-amber-500" />
        </h2>
        <p className="text-slate-400">
          세일즈 마케팅 퍼널이 적용된 기획과 <strong>Nano Banana Pro 3.0</strong> 엔진으로 팔리는 상세페이지를 제작합니다.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-6">
        
        {/* Product Name & Info */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">상품명 <span className="text-rose-500">*</span></label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAutoResearch()}
                        placeholder="예: 닥터포스처 거북목 교정기"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <button
                        onClick={handleAutoResearch}
                        disabled={isResearching || !productName}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-medium text-sm transition-all border border-blue-500 hover:border-blue-400 flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                    >
                        {isResearching ? <Loader2 className="animate-spin" size={16}/> : <Search size={16}/>}
                        {isResearching ? '분석 중...' : 'AI 제품 분석'}
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-1">
                    * 구글 Deep Research 기능을 통해 상품의 셀링포인트와 정보를 자동으로 가져옵니다.
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">상품 정보 <span className="text-rose-500">*</span></label>
                <textarea
                    value={productInfo}
                    onChange={(e) => setProductInfo(e.target.value)}
                    placeholder="AI 제품 분석 버튼을 누르면 자동으로 채워집니다. 또는 직접 입력하세요. (예: 30대 직장인 타겟, 하루 10분 착용, 49,000원)"
                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none resize-none leading-relaxed"
                />
            </div>
        </div>

        {/* Reference Images */}
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">참고 이미지 (필수: 제품 변형 방지)</label>
            <div className="grid grid-cols-5 gap-3">
                {refImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                        {img ? (
                            <div className="w-full h-full rounded-lg overflow-hidden border border-slate-700 group relative">
                                <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-black/70 hover:bg-rose-500 text-white rounded-full p-1 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <label className="w-full h-full bg-slate-900 border border-dashed border-slate-700 hover:border-amber-500/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group">
                                <Upload size={20} className="text-slate-600 group-hover:text-amber-500 mb-1" />
                                <span className="text-[10px] text-slate-600 group-hover:text-slate-400">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} />
                            </label>
                        )}
                    </div>
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">* 업로드한 첫 번째 이미지를 기준으로 제품 외형을 100% 유지합니다.</p>
        </div>

        <div className="h-px bg-slate-700/50 my-4"></div>

        {/* Mode & Count */}
        <div className="flex flex-wrap gap-6 items-end">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-300">생성 모드:</span>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => setMode('AUTO')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            mode === 'AUTO' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Auto (Sales Funnel)
                    </button>
                    <button
                        onClick={() => setMode('MANUAL')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            mode === 'MANUAL' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Manual (수동 설정)
                    </button>
                </div>
            </div>

            {mode === 'MANUAL' && (
                <div className="flex items-center gap-2 animate-fade-in bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                    <span className="text-sm font-medium text-slate-300 px-2">섹션 수:</span>
                    <input 
                        type="number"
                        min={5}
                        max={20}
                        value={manualCount}
                        onChange={(e) => setManualCount(Number(e.target.value))}
                        className="w-16 bg-slate-800 border border-slate-600 rounded p-1 text-center text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                    />
                    <span className="text-xs text-slate-500 px-2">(5~20장)</span>
                </div>
            )}
        </div>

        <button
            onClick={handlePlan}
            disabled={isPlanning || !productName || !productInfo}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-4"
        >
            {isPlanning ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            {isPlanning ? '세일즈 퍼널 기반 상세페이지 기획 시작' : '세일즈 퍼널 기반 상세페이지 기획 시작'}
        </button>
      </div>

      {/* Results Section */}
      {plan.length > 0 && (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        제작 결과물 ({plan.length}개 섹션)
                        <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Sales Funnel Applied</span>
                    </h3>
                    <p className="text-xs text-slate-400">모든 섹션은 한국어로 작성되었으며, 2:3 세로 비율 이미지가 생성됩니다.</p>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerateAllImages}
                        disabled={isBulkGenerating}
                        className="bg-slate-100 text-slate-900 hover:bg-white hover:scale-105 px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-white/10 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isBulkGenerating ? <Loader2 className="animate-spin" size={16} /> : <Layers size={16} />}
                        {isBulkGenerating ? '전체 이미지 생성 중...' : '원클릭 전체 이미지 생성'}
                    </button>
                    
                    {Object.keys(generatedImages).length > 0 && (
                        <button
                            onClick={handleDownloadAll}
                            className="bg-amber-500 text-slate-900 hover:bg-amber-400 hover:scale-105 px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2 animate-fade-in"
                        >
                            <Download size={16} />
                            전체 다운로드
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {plan.map((section, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
                        {/* Left: Text Content */}
                        <div className="lg:w-1/2 p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
                            <div className="mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Section {idx + 1}</span>
                                <h4 className="text-lg font-bold text-amber-400">{section.sectionTitle}</h4>
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                    <span className="text-xs text-slate-500 block mb-2 font-bold">📄 카피라이팅 (Korean)</span>
                                    <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-line">
                                        <ReactMarkdown>{section.copy}</ReactMarkdown>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-xs text-slate-500 block mb-1">🎨 Design Intent</span>
                                    <p className="text-sm text-slate-400 italic">{section.designIntent}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual Content */}
                        <div className="lg:w-1/2 p-6 bg-slate-950 flex flex-col items-center justify-center">
                             <div className="w-full flex justify-between items-center mb-4 px-2">
                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                    <ImageIcon size={12} /> Visual (2:3 Vertical)
                                </span>
                                {!generatedImages[idx] && !isBulkGenerating && (
                                    <button 
                                        onClick={() => handleGenerateImage(idx, section.imagePrompt)}
                                        disabled={generatingImages[idx]}
                                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {generatingImages[idx] ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-amber-500" />}
                                        개별 생성
                                    </button>
                                )}
                             </div>

                             {/* Image Container - Aspect Ratio 3:4 (approx 2:3 vertical feel) */}
                             <div className="w-full max-w-[400px] aspect-[3/4] bg-slate-900 rounded-lg border border-slate-800 overflow-hidden relative shadow-2xl">
                                {generatedImages[idx] ? (
                                    <div className="relative group w-full h-full">
                                        <img src={generatedImages[idx]} alt={section.sectionTitle} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <a 
                                                href={generatedImages[idx]} 
                                                download={`detail_section_${idx + 1}.png`}
                                                className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-amber-400 hover:scale-105 transition-all"
                                            >
                                                <Download size={16} /> 다운로드
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                                        {generatingImages[idx] ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin text-amber-500" size={32} />
                                                <p className="text-sm text-slate-400">Nano Banana Pro<br/>렌더링 중...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 opacity-50">
                                                <Sparkles size={32} className="mx-auto text-slate-600" />
                                                <p className="text-xs text-slate-500">이미지가 생성되면<br/>여기에 표시됩니다.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DetailPageGenerator;