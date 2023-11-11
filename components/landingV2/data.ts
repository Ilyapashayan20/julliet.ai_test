import {BsStars} from 'react-icons/bs';
import {FaAccessibleIcon} from 'react-icons/fa';
import {
    FiAlertOctagon,
    FiBarChart,
    FiBook,
    FiBookOpen,
    FiBriefcase,
    FiCompass,
    FiHome,
    FiLock,
    FiPackage,
    FiPenTool
} from 'react-icons/fi';
import {IoRocketSharp} from 'react-icons/io5';

export const headerLinks = [
    {
        title: 'Características',
        href: '#features'
    },
    {
        title: 'Precios',
        href: '#pricing'
    },
    {
        title: 'Blog',
        href: '/blog'
    }
];

export const footerLinks = [
    {
        title: 'Empresa',
        links: [
            // { label: 'Nuestra historia', href: '#' },
            // { label: 'Trabaja con nosotros', href: '#' },
            // { label: 'Prensa', href: '/press' },
            {label: 'FAQs', href: '/faqs'}
        ]
    },
    {
        title: 'Producto',
        links: [
            {label: '¿Cómo funciona?', href: '#video'},
            {label: 'Precios', href: '#pricing'}
        ]
    },
    // {
    //   title: 'Resources',
    //   links: [
    //     { label: 'Blog', href: '#' },
    //     { label: 'Partnerships', href: '#' },
    //     { label: 'Case studies', href: '#' },
    //     { label: 'Media Assets', href: '#' }
    //   ]
    // },
    {
        title: 'Legal',
        links: [
            {label: 'Terminos', href: '/terms-and-conditions'},
            {label: 'Privacidad', href: '/privacy'}
        ]
    }
];

export const features = [
    {
        name: 'Generación de ideas y contenido',
        description:
            'No te bloquees nunca más, Julliet escribe por ti artículos, emails, historias, tweets o ideas de negocio',
        icon: BsStars
    },
    {
        name: 'Conversa con Julliet',
        description:
            'Si no sabes por dónde empezar, conversa con Julliet y pidele ideas, posts, tweets o cualquier otra cosa que necesites, luego conviertelas en un artículo, editalo y publicalo.',
        icon: IoRocketSharp
    },
    {
        name: 'Publica en tu blog',
        description:
            'Julliet se integra con tu blog y publica  o programa los artículos que generó para que puedas compartirlos con tus clientes.',
        icon: FaAccessibleIcon
    }
];

const planProMonthly = process.env.NEXT_PUBLIC_PLAN_PRO_MONTHLY_ID;
const planProYearly = process.env.NEXT_PUBLIC_PLAN_PRO_YEARLY_ID;

export const pricing = {
    free: {
        name: 'Básico',
        description: 'Para que veas lo increíble que es Julliet',
        price: 'Gratis',
        duration: 'Gratis para siempre',
        extras: 'No se requiere tarjeta de crédito',
        features: [
            '2000 palabras / mes',
            'Escribe 29+ idiomas',
            'Usa 20+ tonos de voz',
            'Ultima tecnología de IA',
            'Editor de texto de ultima generación',
            'Soporte por email',
            '-Integración con wordpress',
            '-Chat con Julliet',
            '-Soporte prioritario'
        ]
    },
    pro: {
        monthly: {
            name: 'Pro',
            description: 'Generación de contenido ilimitada para profesionales',
            price: '$9.99',
            duration: 'por mes',
            extras: '$119.88 por año',
            features: [
                'Artículos infinitos',
                'Escribe 29+ idiomas',
                'Usa 20+ tonos de voz',
                'Ultima tecnología de IA',
                'Editor de texto de ultima generación',
                'Soporte por email',
                'Integración con wordpress',
                'Chat con Julliet',
                'Velocidad 2x de generación',
                'Soporte prioritario'
            ]
        },
        yearly: {
            name: 'Pro',
            description: 'Generación de contenido ilimitada para profesionales',
            price: '$99.99',
            duration: 'por año',
            extras: '2 meses gratis',
            features: [
                'Artículos infinitos',
                'Escribe 29+ idiomas',
                'Usa 20+ tonos de voz',
                'Ultima tecnología de IA',
                'Editor de texto de ultima generación',
                'Soporte por email',
                'Integración con wordpress',
                'Chat con Julliet',
                'Velocidad 2x de generación',
                'Soporte prioritario'
            ]
        }
    }
};

export type NavData = Array<{
    title: string;
    items: Array<{icon: React.ElementType; label: string; href: string}>;
}>;

export const navBarData: NavData = [
    {
        title: 'Producto',
        items: [
            {icon: FiCompass, label: '¿Cómo funciona?', href: '#screenshot'},
            {icon: FiPackage, label: 'Características', href: '#features'}
        ]
    },
    // {
    //   title: 'Features',
    //   items: [{ icon: FiBarChart, label: 'Analytics', href: '#' }]
    // },
    // {
    //   title: 'Learn',
    //   items: [
    //     { icon: FiBookOpen, label: 'Guides', href: '#' },
    //     { icon: FiPenTool, label: 'Blog', href: '#' },
    //     { icon: FiAlertOctagon, label: 'Updates', href: '#' }
    //   ]
    // },
    {
        title: 'Legal',
        items: [
            {icon: FiBriefcase, label: 'Terminos', href: '/terms-and-conditions'},
            {icon: FiLock, label: 'Privacidad', href: '/privacy'}
        ]
    }
];
