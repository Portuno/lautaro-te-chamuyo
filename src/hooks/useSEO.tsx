import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonical?: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

const DEFAULT_SEO: SEOData = {
  title: 'Lautaro - Tu Asistente Digital con Onda Porteña',
  description: 'Lautaro es tu asistente digital con inteligencia artificial y personalidad argentina. Gestiona calendario, transcribe audios, ayuda con tareas y más. ¡Probalo gratis!',
  keywords: 'asistente digital, inteligencia artificial, IA argentina, chatbot, calendario, transcripcion, automatizacion, productividad, Buenos Aires',
  image: 'https://lautaro-te-chamuyo.vercel.app/og-image.jpg',
  type: 'website',
  author: 'Equipo Lautaro'
};

export const useSEO = (seoData?: SEOData) => {
  const location = useLocation();
  
  useEffect(() => {
    const baseUrl = 'https://lautaro-te-chamuyo.vercel.app';
    const currentUrl = `${baseUrl}${location.pathname}`;
    
    // Merge default SEO with page-specific data
    const finalSEO: SEOData = {
      ...DEFAULT_SEO,
      ...seoData,
      url: seoData?.url || currentUrl,
      canonical: seoData?.canonical || currentUrl
    };

    // Update document title
    document.title = finalSEO.title || DEFAULT_SEO.title!;

    // Clear existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-dynamic-seo]');
    existingMetas.forEach(meta => meta.remove());

    // Clear existing JSON-LD
    const existingJsonLd = document.querySelectorAll('script[data-structured-data]');
    existingJsonLd.forEach(script => script.remove());

    // Basic meta tags
    updateMetaTag('description', finalSEO.description!);
    updateMetaTag('keywords', finalSEO.keywords!);
    updateMetaTag('author', finalSEO.author!);

    // Robots meta
    if (finalSEO.noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Canonical link
    updateCanonicalLink(finalSEO.canonical!);

    // Open Graph meta tags
    updateMetaProperty('og:title', finalSEO.title!);
    updateMetaProperty('og:description', finalSEO.description!);
    updateMetaProperty('og:image', finalSEO.image!);
    updateMetaProperty('og:url', finalSEO.url!);
    updateMetaProperty('og:type', finalSEO.type!);
    updateMetaProperty('og:site_name', 'Lautaro');
    updateMetaProperty('og:locale', 'es_AR');

    // Twitter Card meta tags
    updateMetaProperty('twitter:card', 'summary_large_image');
    updateMetaProperty('twitter:site', '@portuno_');
    updateMetaProperty('twitter:creator', '@portuno_');
    updateMetaProperty('twitter:title', finalSEO.title!);
    updateMetaProperty('twitter:description', finalSEO.description!);
    updateMetaProperty('twitter:image', finalSEO.image!);

    // Article-specific meta tags
    if (finalSEO.type === 'article') {
      if (finalSEO.publishedTime) {
        updateMetaProperty('article:published_time', finalSEO.publishedTime);
      }
      if (finalSEO.modifiedTime) {
        updateMetaProperty('article:modified_time', finalSEO.modifiedTime);
      }
      if (finalSEO.section) {
        updateMetaProperty('article:section', finalSEO.section);
      }
      if (finalSEO.tags) {
        finalSEO.tags.forEach(tag => {
          updateMetaProperty('article:tag', tag);
        });
      }
    }

    // Structured Data
    addStructuredData(generateStructuredData(finalSEO, location.pathname));

  }, [seoData, location.pathname]);
};

const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    meta.setAttribute('data-dynamic-seo', 'true');
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.setAttribute('data-dynamic-seo', 'true');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const updateCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    link.setAttribute('data-dynamic-seo', 'true');
    document.head.appendChild(link);
  }
  link.href = href;
};

const addStructuredData = (data: StructuredData) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-structured-data', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

const generateStructuredData = (seo: SEOData, pathname: string): StructuredData => {
  const baseUrl = 'https://lautaro-te-chamuyo.vercel.app';
  
  // Base organization data
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lautaro',
    description: 'Asistente digital con inteligencia artificial y personalidad argentina',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/portuno_',
      'https://instagram.com/JayCharni'
    ],
    foundingDate: '2024',
    foundingLocation: {
      '@type': 'Place',
      name: 'Buenos Aires, Argentina'
    }
  };

  // Page-specific structured data
  switch (pathname) {
    case '/':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Lautaro',
        description: seo.description,
        url: seo.url,
        publisher: organization,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/chat?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };

    case '/chat':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Lautaro Chat',
        description: 'Chat inteligente con asistente digital argentino',
        url: seo.url,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'ARS',
          availability: 'https://schema.org/InStock'
        }
      };

    case '/funciones':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Funciones de Lautaro',
        description: seo.description,
        url: seo.url,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: 11,
          itemListElement: [
            'Soporte administrativo',
            'Atención al cliente',
            'Gestión de redes sociales',
            'Marketing y creación de contenido',
            'Investigación',
            'Gestión de proyectos y eventos',
            'Tareas técnicas y creativas',
            'Finanzas y ventas',
            'Reclutamiento y RR.HH.',
            'Transcripción y traducción',
            'Tareas varias'
          ].map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item
          }))
        }
      };

    case '/contacto':
      return {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contacto - Lautaro',
        description: seo.description,
        url: seo.url,
        mainEntity: organization
      };

    case '/roadmap':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Roadmap - Lautaro',
        description: seo.description,
        url: seo.url,
        about: {
          '@type': 'Thing',
          name: 'Desarrollo de Lautaro',
          description: 'Plan de desarrollo y nuevas funcionalidades'
        }
      };

         default:
       return {
         '@context': 'https://schema.org',
         '@type': 'WebPage',
         name: seo.title,
         description: seo.description,
         url: seo.url,
         publisher: organization
       };
   }
};

// Export types for use in components
export type { SEOData }; 