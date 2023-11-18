import Stripe from 'stripe';
export interface PageMeta {
    title: string;
    description: string;
    cardImage: string;
}

export interface Customer {
    id: string /* primary key */;
    stripe_customer_id?: string;
}

export interface Product {
    id: string /* primary key */;
    active?: boolean;
    name?: string;
    description?: string;
    image?: string;
    metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
    prices?: Price[];
}

export interface IUserDetail {
    id: string /* primary key */;
    first_name: string;
    last_name: string;
    full_name?: string;
    avatar_url?: string;
    is_admin?: boolean;
    is_tutorial_seen?: boolean;
    is_onboarded?: boolean;
    role?: string;
    how_he_find_us?: string;
}

export interface Price {
    id: string /* primary key */;
    product_id?: string /* foreign key to products.id */;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type?: Stripe.Price.Type;
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number | null;
    metadata?: Stripe.Metadata;
    products?: Product;
}

export interface PriceWithProduct extends Price {}

export interface ISubscription {
    id: string /* primary key */;
    user_id: string;
    paddle_user_id?: string;
    subscription_plan_id?: string;
    subscription_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    current_period_end: string;
    next_bill_date: string;
    cancel_url?: string;
    update_url?: string;
    created_at?: any;
}

export interface User {
    id: string /* primary key */;
    instance_id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at?: string;
    invited_at?: string;
    confirmation_sent_at?: string;
    last_sign_in_at?: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface IDocument {
    id?: number /* primary key */;
    user_id: string;
    type: string;
    title: string;
    tone: Tone;
    tags?: string[];
    data?: any;
    text: string;
    word_count: number;
    lang: string;
    generation_mode: string;
    created_at?: string;
    updated_at?: string;
}

export interface IChatMessage {
    id?: string /* primary key */;
    user_id: string;
    tab_id: string;
    is_bot: boolean;
    text: string;
    created_at?: string;
}


export interface IArt{
    id?: string /* primary key */;
    user_id: string;
    image_url: string,
    prompt: string;
    created_at?: string;
}

export enum DocumentType {
    FREE_STYLE = 'free',
    BOOK = 'book',
    ARTICLE = 'article',
    BLOG = 'blog',
    BLOG_OUTLINE = 'blog_outline',
    EMAIL = 'email',
    FAN_FICTION = 'fanfiction',
    ESSAY = 'essay'
}

export const DocumentTypeToSpanish: Record<DocumentType | string, string> = {
    [DocumentType.FREE_STYLE]: 'Estilo libre',
    [DocumentType.BOOK]: 'Libro',
    [DocumentType.ARTICLE]: 'Artículo',
    [DocumentType.BLOG]: 'Blog',
    [DocumentType.BLOG_OUTLINE]: 'Esquema de blog',
    [DocumentType.EMAIL]: 'Email',
    [DocumentType.FAN_FICTION]: 'Fan fiction',
    [DocumentType.ESSAY]: 'Ensayo/Informe'
};

export const DocumentTypeToColor: Record<DocumentType | string, string> = {
    [DocumentType.FREE_STYLE]: 'purple.200',
    [DocumentType.BOOK]: 'orange.900',
    [DocumentType.ARTICLE]: 'purple.200',
    [DocumentType.BLOG]: 'blue.200',
    [DocumentType.BLOG_OUTLINE]: 'blue.200',
    [DocumentType.EMAIL]: 'red.200',
    [DocumentType.FAN_FICTION]: 'pink.200'
};

export enum DocumentLang {
    EN = 'en',
    ES = 'es',
    FR = 'fr',
    PT = 'pt',
    CH = 'ch',
    JA = 'ja',
    DE = 'de',
    IT = 'it',
    RU = 'ru',
    KO = 'ko',
    NL = 'nl',
    SV = 'sv',
    DA = 'da',
    NO = 'no',
    FI = 'fi',
    PL = 'pl',
    TR = 'tr',
    CS = 'cs',
    EL = 'el',
    HU = 'hu',
    RO = 'ro',
    SK = 'sk',
    BG = 'bg',
    SL = 'sl',
    ET = 'et',
    LV = 'lv',
    LT = 'lt',
    HR = 'hr',
    ZH = 'zh'
}

export const DocumentLangIsoToName: Record<DocumentLang, string> = {
    [DocumentLang.EN]: 'English',
    [DocumentLang.ES]: 'Español',
    [DocumentLang.FR]: 'Français',
    [DocumentLang.PT]: 'Português',
    [DocumentLang.CH]: '中文',
    [DocumentLang.JA]: '日本語',
    [DocumentLang.DE]: 'Deutsch',
    [DocumentLang.IT]: 'Italiano',
    [DocumentLang.RU]: 'Русский',
    [DocumentLang.KO]: '한국어',
    [DocumentLang.NL]: 'Nederlands',
    [DocumentLang.SV]: 'Svenska',
    [DocumentLang.DA]: 'Dansk',
    [DocumentLang.NO]: 'Norsk',
    [DocumentLang.FI]: 'Suomi',
    [DocumentLang.PL]: 'Polski',
    [DocumentLang.TR]: 'Türkçe',
    [DocumentLang.CS]: 'Čeština',
    [DocumentLang.EL]: 'Ελληνικά',
    [DocumentLang.HU]: 'Magyar',
    [DocumentLang.RO]: 'Română',
    [DocumentLang.SK]: 'Slovenčina',
    [DocumentLang.BG]: 'Български',
    [DocumentLang.SL]: 'Slovenščina',
    [DocumentLang.ET]: 'Eesti',
    [DocumentLang.LV]: 'Latviešu',
    [DocumentLang.LT]: 'Lietuvių',
    [DocumentLang.HR]: 'Hrvatski',
    [DocumentLang.ZH]: '中文'
};

export const DocumentLangIsoToSpanishName: Record<DocumentLang, string> = {
    [DocumentLang.ES]: 'Español',
    [DocumentLang.EN]: 'Inglés',
    [DocumentLang.FR]: 'Francés',
    [DocumentLang.PT]: 'Portugués',
    [DocumentLang.CH]: 'Chino',
    [DocumentLang.JA]: 'Japonés',
    [DocumentLang.DE]: 'Alemán',
    [DocumentLang.IT]: 'Italiano',
    [DocumentLang.RU]: 'Ruso',
    [DocumentLang.KO]: 'Coreano',
    [DocumentLang.NL]: 'Holandés',
    [DocumentLang.SV]: 'Sueco',
    [DocumentLang.DA]: 'Danés',
    [DocumentLang.NO]: 'Noruego',
    [DocumentLang.FI]: 'Finlandés',
    [DocumentLang.PL]: 'Polaco',
    [DocumentLang.TR]: 'Turco',
    [DocumentLang.CS]: 'Checo',
    [DocumentLang.EL]: 'Griego',
    [DocumentLang.HU]: 'Húngaro',
    [DocumentLang.RO]: 'Rumano',
    [DocumentLang.SK]: 'Eslovaco',
    [DocumentLang.BG]: 'Búlgaro',
    [DocumentLang.SL]: 'Esloveno',
    [DocumentLang.ET]: 'Estonio',
    [DocumentLang.LV]: 'Letón',
    [DocumentLang.LT]: 'Lituano',
    [DocumentLang.HR]: 'Croata',
    [DocumentLang.ZH]: 'Chino'
};

export const DocumentLangToEmoji: Record<DocumentLang, string> = {
    [DocumentLang.EN]: '🇺🇸',
    [DocumentLang.ES]: '🇪🇸',
    [DocumentLang.FR]: '🇫🇷',
    [DocumentLang.PT]: '🇵🇹',
    [DocumentLang.CH]: '🇨🇳',
    [DocumentLang.JA]: '🇯🇵',
    [DocumentLang.DE]: '🇩🇪',
    [DocumentLang.IT]: '🇮🇹',
    [DocumentLang.RU]: '🇷🇺',
    [DocumentLang.KO]: '🇰🇷',
    [DocumentLang.NL]: '🇳🇱',
    [DocumentLang.SV]: '🇸🇪',
    [DocumentLang.DA]: '🇩🇰',
    [DocumentLang.NO]: '🇳🇴',
    [DocumentLang.FI]: '🇫🇮',
    [DocumentLang.PL]: '🇵🇱',
    [DocumentLang.TR]: '🇹🇷',
    [DocumentLang.CS]: '🇨🇿',
    [DocumentLang.EL]: '🇬🇷',
    [DocumentLang.HU]: '🇭🇺',
    [DocumentLang.RO]: '🇷🇴',
    [DocumentLang.SK]: '🇸🇰',
    [DocumentLang.BG]: '🇧🇬',
    [DocumentLang.SL]: '🇸🇮',
    [DocumentLang.ET]: '🇪🇪',
    [DocumentLang.LV]: '🇱🇻',
    [DocumentLang.LT]: '🇱🇹',
    [DocumentLang.HR]: '🇭🇷',
    [DocumentLang.ZH]: '🇨🇳'
};

export enum Tone {
    ASSERTIVE = 'assertive',
    AWESTRUCK = 'awestruck',
    CANDID = 'candid',
    CASUAL = 'casual',
    ENERGETIC = 'energetic',
    ENTREPRENEURIAL = 'entrepreneurial',
    FORMAL = 'formal',
    FRIENDLY = 'friendly',
    FUNNY = 'funny',
    GENTLE = 'gentle',
    HUMOROUS = 'humorous',
    INSPIRATIONAL = 'inspirational',
    INFORMAL = 'informal',
    INTELLECTUAL = 'intellectual',
    JOYFUL = 'joyful',
    NEUTRAL = 'neutral',
    PASSIONATE = 'passionate',
    THOUGHTFUL = 'thoughtful',
    URGENT = 'urgent',
    WORRIED = 'worried'
}

export const ToneToSpanish: Record<Tone, string> = {
    [Tone.ASSERTIVE]: 'Asertivo',
    [Tone.AWESTRUCK]: 'Asombrado',
    [Tone.CANDID]: 'Candido',
    [Tone.CASUAL]: 'Casual',
    [Tone.ENERGETIC]: 'Energetico',
    [Tone.ENTREPRENEURIAL]: 'Emprendedor',
    [Tone.FORMAL]: 'Formal',
    [Tone.FRIENDLY]: 'Amigable',
    [Tone.FUNNY]: 'Divertido',
    [Tone.GENTLE]: 'Suave',
    [Tone.HUMOROUS]: 'Humoristico',
    [Tone.INSPIRATIONAL]: 'Inspirador',
    [Tone.INFORMAL]: 'Informal',
    [Tone.INTELLECTUAL]: 'Intelectual',
    [Tone.JOYFUL]: 'Alegre',
    [Tone.NEUTRAL]: 'Neutral',
    [Tone.PASSIONATE]: 'Apasionado',
    [Tone.THOUGHTFUL]: 'Pensativo',
    [Tone.URGENT]: 'Urgente',
    [Tone.WORRIED]: 'Preocupado'
};

export const ToneToColor: Record<Tone, string> = {
    [Tone.ASSERTIVE]: '#00BCD4',
    [Tone.AWESTRUCK]: '#FFC0CB',
    [Tone.CANDID]: '#F9F6F2',
    [Tone.CASUAL]: '#F5F5DC',
    [Tone.ENERGETIC]: '#FFA500',
    [Tone.ENTREPRENEURIAL]: '#FFD700',
    [Tone.FORMAL]: '#66CDAA',
    [Tone.FRIENDLY]: '#7FFFD4',
    [Tone.FUNNY]: '#00FF00',
    [Tone.GENTLE]: '#8A2BE2',
    [Tone.HUMOROUS]: '#D2691E',
    [Tone.INSPIRATIONAL]: '#FF1493',
    [Tone.INFORMAL]: '#FF4500',
    [Tone.INTELLECTUAL]: '#4B0082',
    [Tone.JOYFUL]: '#FFFF00',
    [Tone.NEUTRAL]: '#A9A9A9',
    [Tone.PASSIONATE]: '#F17C63',
    [Tone.THOUGHTFUL]: '#C71585',
    [Tone.URGENT]: '#0000FF',
    [Tone.WORRIED]: '#800000'
};

export const ToneToEmoji: Record<Tone, string> = {
    [Tone.ASSERTIVE]: '💪',
    [Tone.AWESTRUCK]: '😮',
    [Tone.CANDID]: '😌',
    [Tone.CASUAL]: '🤙',
    [Tone.ENERGETIC]: '🤩',
    [Tone.ENTREPRENEURIAL]: '💡',
    [Tone.FORMAL]: '🤝',
    [Tone.FRIENDLY]: '😃',
    [Tone.FUNNY]: '🤣',
    [Tone.GENTLE]: '🤗',
    [Tone.HUMOROUS]: '😂',
    [Tone.INSPIRATIONAL]: '😇',
    [Tone.INFORMAL]: '🤠',
    [Tone.INTELLECTUAL]: '🤓',
    [Tone.JOYFUL]: '😁',
    [Tone.NEUTRAL]: '😐',
    [Tone.PASSIONATE]: '😍',
    [Tone.THOUGHTFUL]: '🤔',
    [Tone.URGENT]: '😳',
    [Tone.WORRIED]: '😟'
};

export interface IIntegration {
    id?: number;
    user_id?: string;
    name: string;
    type: string;
    username: string;
    password: string;
    host: string;
}

export enum IntegrationType {
    WORDPRESS = 'wordpress'
}

export const IntegrationTypeColor: Record<IntegrationType, string> = {
    [IntegrationType.WORDPRESS]: 'blue.200'
};

export interface ISuggestion {
    id?: number;
    user_id?: string;
    document_id?: number | string | null;
    prompt?: string;
    text?: string;
    raw_data?: any;
    is_accepted?: boolean;
    word_count?: number;
    completion_tokens?: number;
    prompt_tokens?: number;
    created_at?: string;
}

export interface IBlogPost {
    summary: string;
    title: string;
    index: string[];
    sections: IBlogPostSection[];
    epilogue: string;
    wordsCount: number;
    slateData: any;
}

export interface IBlogPostSection {
    title: string;
    content: string;
}
export interface IEssay {
    summary: string;
    title: string;
    index: string[];
    sections: IEssaySection[];
    wordsCount: number;
    slateData: any;
}

export interface IEssaySection {
    title: string;
    content: string;
}

export interface IBlogPostOutline {
    title: string;
    sections: IBlogPostSectionOutline[];
    wordsCount: number;
    slateData: any;
}

export interface IBlogPostSectionOutline {
    title: string;
    sections: IBlogPostSectionOutline[];
}

export interface IEmail {
    title: string;
    paragraphs: string[];
    wordsCount: number;
    slateData: any;
}

export interface IFanFiction {
    title: string;
    summary: string;
    paragraphs: string[];
    wordsCount: number;
    slateData?: any;
}
