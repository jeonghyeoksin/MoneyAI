import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import { planProductConcepts, generateProductShot } from '../services/geminiService';
import { ProductConcept, AppView } from '../types';
import FeatureHeader from './common/FeatureHeader';

interface GeneratedResult {
  concept: ProductConcept;
  imageUrl: string | null;
}

interface ImageData {
  base64: string;
  mimeType: string;
}

const ProductPhotographer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResults([]);
    }
  };

  const convertToImageData = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const mimeType = file.type || 'image/png';
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleStart = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setResults([]);
    
    try {
      // 1. Convert Image
      setProgress('이미지를 분석하고 있습니다...');
      const imageData = await convertToImageData(selectedFile);

      // 2. Plan Concepts
      setProgress('제품에 어울리는 5가지 컨셉을 기획 중입니다...');
      let concepts: ProductConcept[] = [];
      try {
        concepts = await planProductConcepts(imageData.base64);
      } catch (planError: any) {
        console.error("Planning Error:", planError);
        throw new Error(`컨셉 기획 중 오류가 발생했습니다: ${planError.message || 'API 응답 오류'}`);
      }
      
      if (!concepts || concepts.length === 0) {
        throw new Error("컨셉 기획 결과가 비어있습니다. 다시 시도해주세요.");
      }

      // 3. Generate Images (Parallel)
      setProgress('스튜디오 촬영을 진행 중입니다... (최대 1분 소요)');
      const generationPromises = concepts.map(async (concept, idx) => {
        try {
          const imageUrl = await generateProductShot(imageData.base64, concept.prompt, imageData.mimeType);
          return { concept, imageUrl };
        } catch (genError: any) {
          console.error(`Generation Error for concept ${idx}:`, genError);
          return { concept, imageUrl: null }; // Return null for this specific image but don't crash the whole process
        }
      });

      const generatedResults = await Promise.all(generationPromises);
      setResults(generatedResults);
      
      const successCount = generatedResults.filter(r => r.imageUrl).length;
      if (successCount === 0) {
        setProgress('이미지 생성 실패');
        alert('모든 이미지 생성에 실패했습니다. API 키 권한이나 할당량을 확인해주세요.');
      } else {
        setProgress('완료!');
      }

    } catch (e: any) {
      console.error("Overall Error:", e);
      const errorMessage = e.message || '알 수 없는 오류가 발생했습니다.';
      alert(`작업 중 오류가 발생했습니다.\n\n상세 내용: ${errorMessage}\n\n잠시 후 다시 시도해주세요.`);
      setProgress('오류 발생');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <FeatureHeader view={AppView.PRODUCT_PHOTO} title="대표 이미지 만들기" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-fit">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-amber-400" /> 제품 사진 업로드
            </h3>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                previewUrl ? 'border-amber-500/50 bg-slate-900/50' : 'border-slate-700 hover:border-slate-500 bg-slate-900'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
              />
              
              {previewUrl ? (
                <div className="relative group">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-sm">사진 변경하기</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                    <ImageIcon className="text-slate-400" size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-medium">클릭하여 이미지 업로드</p>
                    <p className="text-slate-500 text-xs">JPG, PNG (최대 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleStart}
                disabled={!selectedFile || isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-amber-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {isProcessing ? '작업 진행 중...' : '이미지 5장 생성하기'}
              </button>
            </div>

            {isProcessing && (
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="animate-spin text-amber-500" size={16} />
                  <span className="text-sm text-slate-300 font-medium">{progress}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full animate-pulse w-2/3"></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-400">💡 촬영 팁</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>제품이 중앙에 잘 보이는 사진을 골라주세요.</li>
              <li>복잡한 배경보다는 단순한 배경이 좋습니다.</li>
              <li>AI가 원본 제품의 형태를 최대한 유지하지만, 조명에 따라 미세한 색감 차이가 있을 수 있습니다.</li>
            </ul>
          </div>
        </div>

        {/* Right: Gallery Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-slate-200">생성된 결과물</h3>
            {results.length > 0 && !isProcessing && (
              <span className="text-sm text-amber-500 font-medium">{results.filter(r => r.imageUrl).length}장 생성 완료</span>
            )}
          </div>

          {!isProcessing && results.length === 0 ? (
            <div className="h-[500px] bg-slate-800/20 border border-slate-700/30 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-4">
              <Camera size={48} className="opacity-20" />
              <p>사진을 업로드하고 생성을 시작하세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result, idx) => (
                <div key={idx} className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-all shadow-lg">
                  <div className="relative aspect-square bg-black/20">
                    {result.imageUrl ? (
                      <>
                        <img src={result.imageUrl} alt={result.concept.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                          <a 
                            href={result.imageUrl} 
                            download={`product_concept_${idx + 1}.png`}
                            className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-amber-400 hover:scale-105 transition-all"
                          >
                            <Download size={16} /> 저장
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                        <span className="text-sm">이미지 생성 실패</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-800/80">
                    <h4 className="font-bold text-slate-200 mb-1">{result.concept.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{result.concept.description}</p>
                  </div>
                </div>
              ))}
              
              {/* If odd number of results, add a placeholder or prompt to create more? No, just grid. */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPhotographer;