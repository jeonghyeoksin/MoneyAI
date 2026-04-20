import { AppView } from '../types';

export interface FeatureMetadata {
  manual: string;
  minCost: number;
  maxCost: number;
}

export const FEATURE_METADATA: Record<string, FeatureMetadata> = {
  [AppView.TODAY_ITEM]: {
    manual: "1. 원하는 아이템 개수를 선택하세요.\n2. 키워드 추출 버튼을 누르면 추천 리스트가 나타납니다.\n3. 결과는 스토어 소싱이나 블로그 포스팅 키워드로 활용하세요.",
    minCost: 1,
    maxCost: 10
  },
  [AppView.PRODUCT_PHOTO]: {
    manual: "1. 배경이 단순한 제품 사진 1장을 업로드하세요 (최대 5MB).\n2. 생성하기 버튼을 누르면 AI 포토그래퍼가 5가지 전문 컨셉 사진을 제작합니다.\n3. 고퀄리티 렌더링이므로 약 30초~1분이 소요됩니다.",
    minCost: 150,
    maxCost: 400
  },
  [AppView.DETAIL_HOOK]: {
    manual: "1. 판매할 상품명을 정확히 입력하세요.\n2. 상단에 들어갈 강력한 카피 3종(감성, 실용, 고급)이 즉시 생성됩니다.\n3. 이 카피를 상세페이지 상단 텍스트로 활용하세요.",
    minCost: 10,
    maxCost: 50
  },
  [AppView.DETAIL_PAGE]: {
    manual: "1. 상품명과 상품 정보를 상세히 입력하거나 'AI 분석'을 활용하세요.\n2. 참고 이미지(제품 원본)를 올리면 제품 외형을 100% 유지하며 생성됩니다.\n3. 기획안 확인 후 '이미지 일괄 생성'을 통해 전체 상세페이지를 완성하세요.",
    minCost: 1000,
    maxCost: 5000
  },
  [AppView.NEWSLETTER]: {
    manual: "1. 뉴스레터의 주제를 입력하세요.\n2. 구독자의 행동을 유도하는 전문 뉴스레터 초안이 생성됩니다.\n3. 생성된 결과를 본인의 이메일 마케팅 툴로 복사해 사용하세요.",
    minCost: 20,
    maxCost: 100
  },
  [AppView.INSTAGRAM]: {
    manual: "1. 카드뉴스로 만들 주제를 입력하고 원하는 디자인 스타일을 고르세요.\n2. 각 슬라이드별 구성과 캡션 전문이 생성됩니다.\n3. 이를 바탕으로 캔바(Canva)나 미리캔버스에서 제작하세요.",
    minCost: 30,
    maxCost: 150
  },
  [AppView.YOUTUBE_PLAN]: {
    manual: "1. 제작할 영상의 주제를 입력하세요.\n2. 알고리즘 최적화 썸네일, 15초 훅, 전체 구조 스크립트를 설계합니다.\n3. 제공된 구조를 바탕으로 영상을 촬영하고 편집하세요.",
    minCost: 50,
    maxCost: 250
  }
};

export const PATCH_NOTES = [
  {
    date: "2026.04.20",
    content: [
      "이미지 생성 모델 고도화 - 한국어 텍스트 깨짐 지시사항 강화 및 3.1 Pro급 엔진 적용",
      "사용자 편의성 향상 - 각 기능별 '사용방법' 및 'API 비용 계산기' 도입",
      "대시보드 실시간 패치노트 시스템 구축",
      "전체 UI/UX 폴리싱 및 가독성 개선 작업"
    ]
  },
  {
    date: "2026.04.15",
    content: [
        "상세페이지 생성 - Reference Image 기반 제품 일관성 유지 기능 추가",
        "구글 Deep Research 연동 - 상품명만으로 셀링포인트 자동 분석 지원"
    ]
  }
];
