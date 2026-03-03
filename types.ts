export enum AppView {
  DASHBOARD = 'DASHBOARD',
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE_PLAN = 'YOUTUBE_PLAN',
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  TODAY_ITEM = 'TODAY_ITEM',
  PRODUCT_PHOTO = 'PRODUCT_PHOTO',
  DETAIL_HOOK = 'DETAIL_HOOK',
  DETAIL_PAGE = 'DETAIL_PAGE',
  NEWSLETTER = 'NEWSLETTER',
}

export interface VideoGenerationConfig {
  prompt: string;
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
}

export interface ImageGenerationConfig {
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '3:4' | '4:3';
}

export interface InstaCarouselConfig {
  topic: string;
  slideCount: number;
}

export interface ProductConcept {
  title: string;
  description: string;
  prompt: string;
}

export interface HookCopyResult {
  emotional: string;
  practical: string;
  luxurious: string;
}

export interface DetailPageSection {
  sectionTitle: string;
  copy: string;
  designIntent: string;
  imagePrompt: string;
}