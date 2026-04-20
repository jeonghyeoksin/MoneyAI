import React from 'react';
import { 
  LayoutDashboard, 
  Instagram, 
  Youtube, 
  Video, 
  TrendingUp, 
  DollarSign,
  Users,
  Activity,
  ShoppingBag,
  Camera,
  MessageSquareQuote,
  Mail,
  FileText
} from 'lucide-react';

export const APP_NAME = "돈버는AI";

export const MENU_ITEMS = [
  { id: 'DASHBOARD', label: '대시보드', icon: <LayoutDashboard size={20} /> },
  { id: 'TODAY_ITEM', label: '오늘 뭐 팔지? (소싱)', icon: <ShoppingBag size={20} /> },
  { id: 'PRODUCT_PHOTO', label: '대표 이미지 만들기', icon: <Camera size={20} /> },
  { id: 'DETAIL_HOOK', label: '상세페이지 후킹 문구', icon: <MessageSquareQuote size={20} /> },
  { id: 'DETAIL_PAGE', label: '상세페이지 생성', icon: <FileText size={20} /> },
  { id: 'NEWSLETTER', label: '뉴스레터 생성', icon: <Mail size={20} /> },
  { id: 'INSTAGRAM', label: '인스타 캐러셀 기획', icon: <Instagram size={20} /> },
  { id: 'YOUTUBE_PLAN', label: '유튜브 콘텐츠 기획', icon: <Youtube size={20} /> },
  { id: 'YOUTUBE_VIDEO', label: '유튜브 영상 제작', icon: <Video size={20} /> },
];

export const MOCK_CHART_DATA = [
  { name: '1월', earnings: 1200, traffic: 4000 },
  { name: '2월', earnings: 1900, traffic: 5500 },
  { name: '3월', earnings: 3200, traffic: 8000 },
  { name: '4월', earnings: 4100, traffic: 12000 },
  { name: '5월', earnings: 6500, traffic: 18000 },
  { name: '6월', earnings: 8900, traffic: 24000 },
];

// Mock Data for "Sourcing Keywords.docx"
export const SOURCING_KEYWORDS = [
  "무선 충전기", "차량용 거치대", "게이밍 마우스", "기계식 키보드", "노트북 거치대",
  "블루투스 이어폰", "스마트 워치 스트랩", "보조 배터리", "USB 허브", "모니터 암",
  "요가 매트", "폼롤러", "아령", "손목 보호대", "무릎 보호대",
  "캠핑 의자", "캠핑 랜턴", "차박 텐트", "피크닉 매트", "보냉백",
  "에어프라이어 용기", "실리콘 조리도구", "텀블러", "머그컵 워머", "미니 믹서기",
  "극세사 이불", "암막 커튼", "바디필로우", "규조토 발매트", "디퓨저",
  "차량용 방향제", "세차 타월", "트렁크 정리함", "목 쿠션", "핸들 커버",
  "강아지 간식", "고양이 장난감", "배변 패드", "애견 의류", "자동 급식기",
  "여행용 캐리어", "여권 지갑", "목베개", "압축 파우치", "멀티 어댑터",
  "양말 세트", "슬리퍼", "에코백", "카드 지갑", "블루라이트 차단 안경",
  "마스크팩", "핸드크림", "립밤", "선크림", "헤어 에센스",
  "무드등", "LED 스트립", "스마트 플러그", "멀티탭 정리함", "케이블 타이",
  "독서대", "만년필", "다이어리", "데스크 매트", "마스킹 테이프",
  "분리수거함", "음식물 쓰레기통", "빨래 바구니", "옷걸이", "압축봉",
  "욕실 슬리퍼", "샤워기 필터", "변기 세정제", "칫솔 살균기", "치약 짜개",
  "미니 가습기", "미니 선풍기", "온수 매트", "전기 방석", "발난로",
  "우산", "우비", "장화", "신발 방수 커버", "제습제",
  "골프 장갑", "골프공", "등산 스틱", "등산 양말", "쿨토시",
  "자전거 라이트", "자전거 자물쇠", "헬멧", "무릎 담요", "수면 양말"
];