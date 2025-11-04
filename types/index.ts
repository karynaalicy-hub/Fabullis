

export interface User {
  id: number;
  nome_usuario: string;
  email: string;
  avatar_url?: string;
  password?: string;
  role?: 'admin' | 'author';
}

export enum StoryStatus {
  EmAndamento = "em_andamento",
  Concluida = "concluida",
  Hiato = "hiato",
}

export enum StoryType {
  Livro = "livro",
  Conto = "conto",
  Fanfic = "fanfic",
}

export enum Language {
    Portuguese = "pt",
    English = "en",
    Spanish = "es",
}

export interface Genre {
  id: number;
  nome: string;
}

export interface Story {
  id: number;
  autor_id: number;
  titulo: string;
  sinopse: string;
  capa_url: string;
  idioma: Language;
  status: StoryStatus;
  tipo: StoryType;
  data_publicacao: string;
  data_atualizacao: string;
  generos: number[]; // Array of Genre IDs
  isPremium?: boolean;
}

export interface Chapter {
  id: number;
  historia_id: number;
  numero_capitulo: number;
  titulo_capitulo: string;
  conteudo: string;
  data_publicacao: string;
  isPremium?: boolean;
}

export interface ReadingProgress {
  chapterNumber: number;
  scrollPosition: number;
  timestamp: number;
  readChapters: number[];
}

export interface Subscription {
  userId: number;
  storyId: number;
}

export interface Notification {
  id: number;
  userId: number;
  chapterId: number;
  isRead: boolean;
  timestamp: string;
}

export interface Comment {
  id: number;
  chapterId: number;
  userId: number;
  content: string;
  timestamp: string;
  isReported?: boolean;
}

export interface StoryLike {
    userId: number;
    storyId: number;
}

export interface ChapterLike {
    userId: number;
    chapterId: number;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    description: string;
    durationDays: number; // 30 for monthly, 365 for yearly
}

export interface UserSubscription {
    id: number;
    userId: number;
    planId: number;
    startDate: string;
    endDate: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    coverUrl: string;
    type: 'book' | 'ebook';
}

export interface CartItem {
  id: number; // product id or plan id
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'subscription';
  coverUrl?: string; // specific to product
  description?: string;
}


export interface SaleItem {
    productId: number;
    quantity: number;
    price: number; // Price at the time of sale
}

export interface Sale {
    id: number;
    userId: number;
    items: SaleItem[];
    total: number;
    date: string;
}