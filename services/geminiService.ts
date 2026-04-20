import { GoogleGenAI, Type } from "@google/genai";
import { ProductConcept, HookCopyResult, DetailPageSection } from "../types";
import { getActiveApiKey } from "./apiKeyService";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
  }
}

// Helper to check for Veo Key selection
export const checkAndSelectApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      if (window.aistudio.openSelectKey) {
         await window.aistudio.openSelectKey();
         return await window.aistudio.hasSelectedApiKey();
      }
      return false;
    }
    return true;
  }
  // Fallback if not running in the specific environment, implies process.env is enough or handled otherwise
  return true; 
};

export const generateBlogPost = async (topic: string, tone: string, audience: string): Promise<string> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    당신은 월 1000만원 이상의 수익을 내는 전문 블로그 마케터입니다.
    다음 주제에 대해 SEO에 최적화되고 독자의 체류 시간을 늘리는 블로그 글을 작성해주세요.
    
    주제: ${topic}
    타겟 독자: ${audience}
    어조: ${tone}
    
    필수 요소:
    1. 클릭을 유도하는 매력적인 제목 3가지 추천
    2. 본문 (서론, 본론, 결론 구조, 소제목 포함)
    3. 수익화를 위한 자연스러운 CTA (Call To Action)
    4. 관련 해시태그 10개
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    }
  });

  return response.text || "생성 실패";
};

export const generateNewsletter = async (topic: string): Promise<string> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    전문 뉴스레터 에디터로서 구독자의 팬덤을 강화하고 클릭을 유도하는 뉴스레터를 작성해주세요.
    주제: ${topic}

    구성 요구사항:
    1. [제목]: 오픈율을 높이는 호기심 자극 제목 2~3개 추천
    2. [오프닝]: 독자와의 유대감을 형성하는 따뜻하고 인사이트 있는 도입부
    3. [본문]: 주제에 대한 깊이 있는 정보, 트렌드, 또는 팁 (가독성 좋게 글머리 기호 활용)
    4. [CTA]: 상품 페이지 방문, 유튜브 시청 등 자연스러운 행동 유도 문구
    5. [클로징]: 다음 뉴스레터를 기대하게 만드는 마무리 인사

    톤앤매너: 전문적이지만 친근하게, 독자에게 도움이 된다는 느낌을 줄 것.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    }
  });

  return response.text || "생성 실패";
};

export const generateInstaCarousel = async (topic: string, count: number, style: string = 'DEFAULT'): Promise<string> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  let stylePrompt = "";
  switch (style) {
    case 'MONEY_DARK':
        stylePrompt = `
        [디자인 스타일: 머니 다크]
        - 배경: 검정색(#000000) 또는 아주 어두운 회색.
        - 텍스트: 형광 노랑, 주황, 또는 흰색의 고대비 색상 사용.
        - 폰트: 굵고 강렬한 고딕체(Bold Sans-serif).
        - 레이아웃: 핵심 키워드 중심의 리스트 형태. 금융, 주식, 동기부여 콘텐츠에 적합.
        `;
        break;
    case 'CLEAN_INFO':
        stylePrompt = `
        [디자인 스타일: 클린 인포]
        - 배경: 흰색(#FFFFFF) 또는 아주 연한 민트/그레이 배경.
        - 텍스트: 짙은 녹색, 네이비 등 신뢰감을 주는 색상.
        - 요소: 깔끔한 라운드 박스, 체크 아이콘, 진행바(Progress bar) 활용.
        - 레이아웃: 정보 전달, 순위, 비교 분석에 적합한 깔끔한 정리형.
        `;
        break;
    case 'DATA_RANK':
        stylePrompt = `
        [디자인 스타일: 데이터 랭크]
        - 배경: 엑셀이나 표 느낌의 정돈된 배경 (연한 녹색/회색 톤).
        - 구조: 명확한 행(Row)과 열(Column)이 있는 표(Table) 형태.
        - 특징: 순위(1위, 2위...), 수치 데이터, 등락폭 강조.
        - 레이아웃: 많은 정보를 한눈에 보여주는 통계/랭킹형 디자인.
        `;
        break;
    case 'VISUAL_GRID':
        stylePrompt = `
        [디자인 스타일: 비주얼 그리드]
        - 배경: 다크 모드 기반에 네온 글로우 효과.
        - 구조: 2x2 또는 3x2 격자(Grid) 카드 배치.
        - 특징: 각 격자마다 로고, 아이콘, 또는 대표 이미지를 크게 배치.
        - 레이아웃: 포트폴리오, 종목 모음, 도구 모음 등 시각적 요소가 중요한 디자인.
        `;
        break;
    default:
        stylePrompt = `
        [디자인 스타일: 기본]
        - 가독성이 좋고 깔끔한 인스타그램 카드뉴스 스타일.
        `;
        break;
  }

  const prompt = `
    인스타그램 인사이트를 폭발시킬 캐러셀 콘텐츠 기획안을 작성해주세요.
    주제: ${topic}
    슬라이드 수: ${count}장
    
    ${stylePrompt}
    
    출력 형식:
    각 슬라이드별로 아래 항목을 반드시 포함하여 작성해주세요.
    1. [슬라이드 번호/역할]: (예: 1페이지 - 훅)
    2. [메인 카피]: 이미지에 들어갈 핵심 문구 (폰트 크기 및 색상 가이드 포함)
    3. [서브 카피]: 부연 설명 텍스트
    4. [비주얼/디자인 가이드]: 선택한 '${style}' 스타일에 맞춰 배경, 배치, 아이콘, 도형 등을 구체적으로 묘사 (디자이너에게 지시하듯)
    5. [캡션 글]: 마지막에 인스타그램 게시물 본문에 들어갈 텍스트와 해시태그 작성.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: prompt,
  });

  return response.text || "생성 실패";
};

export const generateYoutubePlan = async (topic: string): Promise<string> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    유튜브 조회수 100만을 목표로 하는 영상 기획안을 작성해주세요.
    주제: ${topic}
    
    포함 내용:
    1. 썸네일 카피 및 이미지 구상 (클릭률 높은 방식)
    2. 훅(Hook) - 초반 15초 대사
    3. 영상 구조 (인트로 - 본론 - 아웃트로) 타임라인
    4. 촬영 및 편집 포인트
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
    });
    return response.text || "생성 실패";
  } catch (e) {
    console.error("Youtube plan generation failed", e);
    throw e;
  }
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", refImageBase64?: string, mimeType: string = 'image/png'): Promise<string | null> => {
  await checkAndSelectApiKey();
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });
  
  // Use gemini-1.5-flash for image generation if supported or standard imagen
  const modelName = 'gemini-1.5-flash'; 
  
  // Enhance prompt for text rendering and consistency with extreme emphasis on Korean
  let finalPrompt = `${prompt}, commercial photography, 8k, photorealistic. 
    IMPORTANT: If there is text in the image, it MUST be rendered in PERFECT Korean (Hangeul). 
    Absolutely no broken characters, scrambled glyphs, or typos. 
    Use a clean, professional Korean font style. The Korean text must be clear and legible.`;
  
  if (prompt.includes('Text "')) {
      finalPrompt += ", professional Korean typography, advertising poster style, clear Korean text rendering, legible Korean font, high contrast text, absolutely no broken characters or typos";
  }
    
  if (refImageBase64) {
      finalPrompt += ". IMPORTANT: Preserve the main product from the reference image exactly. Do not alter the product's shape, logo, or color. Only change the background and add the specified text.";
  }

  const parts: any[] = [{ text: finalPrompt }];
  if (refImageBase64) {
      parts.unshift({
          inlineData: {
              mimeType: mimeType,
              data: refImageBase64
          }
      });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: '1K'
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e: any) {
    console.error("Image generation failed", e);
    // If specific image model fails, try informative error
    if (e.message?.includes('403') || e.message?.includes('permission')) {
        throw new Error("이미지 생성 권한이 없거나 유료 API 키가 필요합니다. (403 Permission Denied)");
    }
    throw e;
  }
  return null;
};

export const generateVideo = async (config: {
  prompt: string;
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
  includeSubtitles: boolean;
}): Promise<string | null> => {
  // CRITICAL: Veo requires specific key selection in some environments
  await checkAndSelectApiKey();
  
  // Create instance just before call to ensure fresh key if selected
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const finalPrompt = config.includeSubtitles 
    ? `${config.prompt}. Include professional Korean subtitles at the bottom of the screen.`
    : config.prompt;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: finalPrompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution as any,
      aspectRatio: config.aspectRatio as any
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) return null;

  // Append API key for download
  return `${downloadLink}&key=${getActiveApiKey()}`;
};

// --- Product Photography Services ---

export const planProductConcepts = async (base64Image: string): Promise<ProductConcept[]> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze the product in this image (features, color, material, shape).
    Then, act as a professional product photographer and art director.
    Create 5 distinct and creative photography concepts to make this product sell well on e-commerce platforms.
    
    Each concept must include:
    1. A short, catchy title (e.g., "Luxury Minimal", "Nature Fresh").
    2. A brief description of the mood and setting.
    3. A detailed image generation prompt that describes the background, lighting, and props.
       IMPORTANT: The prompt must emphasize keeping the main product exactly as is, but placed in this new setting.
       The prompt should be in English for better image generation results.

    Return the result in JSON format with the following schema:
    Array of objects: { "title": string, "description": string, "prompt": string }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Use flash for better compatibility
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              prompt: { type: Type.STRING },
            },
            required: ['title', 'description', 'prompt']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse concept plan", e);
    throw e;
  }
};

export const generateProductShot = async (base64Image: string, conceptPrompt: string, mimeType: string = 'image/png'): Promise<string | null> => {
  await checkAndSelectApiKey();
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  // Prepend instruction to preserve the product and ensure Korean quality
  const fullPrompt = `
    Product Photography.
    Main subject: The object in the input image. 
    Action: Place the exact same object into a new scene.
    Scene Description: ${conceptPrompt}
    Requirements: 
    1. Preserve the product's appearance, shape, color, and branding 100%.
    2. High resolution, 1000x1000 pixels.
    3. Photorealistic, 8k, professional studio lighting.
    4. If any text appears, it MUST be perfect Korean (Hangeul) with no artifacts or broken parts. The Korean font should be clean and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', 
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Image } },
          { text: fullPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '1K',
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Image generation failed", e);
    throw e;
  }
  return null;
};

// --- Hook Copy Services ---

export const generateDetailHooks = async (productName: string): Promise<HookCopyResult | null> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    당신은 한국 최고의 이커머스 상세페이지 기획자이자 카피라이터입니다.
    사용자가 입력한 상품명: "${productName}"
    
    이 상품명을 바탕으로 주요 기능, 특징, 타겟, 구매 혜택을 스스로 유추하고 가정하세요.
    상세페이지 최상단에 들어갈, 단 한 줄만 읽어도 사고 싶게 만드는 '후킹 문구'를 3가지 버전으로 작성해주세요.
    
    1. 감성적 톤 (Emotional): 공감, 욕망 자극, "나를 위한 선물" 느낌.
    2. 실용적 톤 (Practical): 기능, 효과, 가성비, 문제 해결 강조, 신뢰감.
    3. 고급스러움 톤 (Luxurious): 프리미엄, 브랜드 가치, 차별화된 품격.
    
    규칙:
    - 각 문구는 약 300자 내외로 작성하세요.
    - 네이버 스마트스토어, 쿠팡 등에서 잘 팔리는 말투를 사용하세요.
    - 기획서 없이 바로 쓸 수 있도록 완성도 높은 문장으로 제공하세요.
    - 한국어 맞춤법과 띄어쓰기를 완벽하게 지키세요. 깨진 글자가 없어야 합니다.
    
    결과를 JSON 형식으로 반환하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotional: { type: Type.STRING },
            practical: { type: Type.STRING },
            luxurious: { type: Type.STRING },
          },
          required: ['emotional', 'practical', 'luxurious'],
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as HookCopyResult;
  } catch (e) {
    console.error("Hook generation failed", e);
    return null;
  }
};

// --- Research & Detail Page Generation ---

export const researchProductInfo = async (productName: string): Promise<string | null> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Research the product "${productName}" using Google Search to understand what it is.
    Identify its key features, selling points, target audience, and main benefits.
    
    Then, summarize this information in Korean for a product detail page planner.
    
    Format the output as follows:
    - 상품 특징: [List of key features]
    - 타겟 고객: [Who is this for?]
    - 핵심 혜택: [Main benefits to the user]
    - 셀링 포인트: [Why should someone buy this?]
    
    Keep it concise but informative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro', // Use pro for better research quality
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    return response.text;
  } catch (e) {
    console.error("Product research failed", e);
    return null;
  }
};

export const planDetailPage = async (
  productName: string,
  productInfo: string,
  refImages: { base64: string, mimeType: string }[], 
  mode: 'AUTO' | 'MANUAL', 
  count?: number
): Promise<DetailPageSection[]> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    Role: Top-tier E-commerce CRO Specialist & Art Director.
    Task: Plan a high-converting detail page for a product following a strict Sales Marketing Funnel.
    
    [STRUCTURE: SALES MARKETING FUNNEL]
    The output sections must follow this logical flow:
    1. **Hook (후킹)**: Grab attention immediately. Show the result or the main benefit.
    2. **Problem (문제 제기)**: Highlight the customer's pain point.
    3. **Agitation (위기감 조성)**: Emphasize why this problem needs solving now.
    4. **Solution (해결책)**: Introduce the product as the best solution.
    5. **Features/Benefit (특장점)**: Key selling points and technical details.
    6. **Social Proof (입증)**: Reviews, ratings, certifications.
    7. **CTA (구매 유도)**: Final push to buy.
    
    [GENERATION RULES]
    1. **Korean Text Only**: All 'copy' fields MUST be written in natural, persuasive, high-converting Korean. No English in the copy.
    2. **Multi-line Korean Text in Images**: Every generated image MUST include **at least two lines** of Korean text overlay (e.g., Headline + Subtext).
       - In the 'imagePrompt' field, you MUST explicitly include instructions to render this text clearly without any broken characters.
       - Format: 'Text "HEADLINE_TEXT" and "SUB_TEXT" are written clearly in the [position] in a [style] Korean font, perfect Korean typography, no broken text.'
       - Example: 'Text "압도적 흡입력" and "먼지 걱정 끝" are written clearly in bold Korean font, perfect Korean typography, no broken text.'
       - Keep each line short (2-5 words) but ensure there are multiple lines to convey the message effectively.
    3. **Visual Consistency**: The 'imagePrompt' must be extremely detailed to ensure the product looks exactly like the reference. Describe the product's shape, color, and material from the reference image in the prompt.
    4. **Design**: The 'designIntent' should specify a layout that fits a vertical (2:3 aspect ratio) scroll mobile view (e.g., "Poster layout with text at the top and product at bottom").
    
    [TONE & MANNER]
    Analyze the product info to decide the tone (e.g., Clinical for health, Luxurious for beauty). Apply this tone to all copies and visuals.

    Output JSON Schema (Array of Objects):
    {
      "sectionTitle": string (e.g., "Hook - 압도적 성능"),
      "copy": string (Main persuasive text in Korean),
      "designIntent": string (Design guide: "Vertical layout, text overlay, clean background"),
      "imagePrompt": string (Visual prompt: "Product photography of [Product Description], [Scene Context], Text '완벽한 자세' and '하루 10분' are written in bold font, 8k --style nano banana pro 3.0")
    }
  `;

  let userPrompt = `
    상품명: ${productName}
    상품 정보: ${productInfo}
    모드: ${mode}
  `;

  if (refImages.length > 0) {
    userPrompt += `\n[참고 이미지 제공됨]: 이 이미지의 제품을 100% 동일하게 유지하면서 상세페이지를 기획하세요. 제품의 외형을 정확히 분석하여 imagePrompt에 포함시키세요.`;
  }
  
  if (mode === 'MANUAL' && count) {
    userPrompt += `\n요청 섹션 수: ${count}개 (퍼널 구조에 맞춰 배분)`;
  } else {
    userPrompt += `\n요청 섹션 수: Sales Funnel을 완벽하게 소화할 수 있는 최적의 길이 (최소 6개 이상)`;
  }

  // Construct Content Parts (Multimodal if images exist)
  const parts: any[] = [{ text: userPrompt }];
  
  // Add reference images to prompt parts
  refImages.forEach(img => {
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64
      }
    });
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sectionTitle: { type: Type.STRING },
              copy: { type: Type.STRING },
              designIntent: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
            },
            required: ['sectionTitle', 'copy', 'designIntent', 'imagePrompt']
          }
        },
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as DetailPageSection[];
  } catch (e) {
    console.error("Detail page planning failed", e);
    return [];
  }
};