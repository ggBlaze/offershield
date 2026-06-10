import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Trust } from "@/components/sections/Trust";
import { DisclaimerBanner } from "@/components/sections/DisclaimerBanner";
import { Analyzer } from "@/components/analyzer/Analyzer";
import {
  LOCALES,
  LOCALE_TAG,
  isLocale,
  dictionaries,
  type Locale,
} from "@/lib/i18n";

const siteUrl = "https://offershield.pro";

// Build a per-locale URL like /es, /zh, /en
function localeUrl(lang: Locale) {
  return `${siteUrl}/${lang}`;
}

// Map locale -> JSON-LD og:locale value
const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  zh: "zh_CN",
};

/**
 * Per-locale SEO. Every meta tag — including the social-share
 * ones — is in the same language as the URL, so a Spanish link
 * shared on Twitter/X shows a Spanish preview, a Chinese link
 * shows a Chinese preview, and so on.
 *
 * The hreflang alternates connect every locale to every other
 * locale so Google indexes the cluster correctly.
 */
export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  const lang = params.lang as Locale;
  if (!isLocale(lang)) return {};
  const dict = dictionaries[lang];
  const path = `/${lang}`;
  const canonical = `${siteUrl}${path}`;

  // Build alternates for every locale.
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[LOCALE_TAG[l]] = `${siteUrl}/${l}`;
  }
  // x-default -> the canonical English version.
  languages["x-default"] = `${siteUrl}/en`;

  return {
    title: {
      // Override the layout's "%s · OfferShield" template — the per-
      // locale title already includes the brand name.
      absolute: dict.meta.title,
    },
    description: dict.meta.description,
    keywords: [
      lang === "en"
        ? "contract explainer, offer letter analyzer, AI legal assistant"
        : lang === "es"
          ? "explicador de contratos, analizador de ofertas, asistente legal IA"
          : "合同解读,Offer 分析,AI 法律助手",
      "MiniMax-M3",
    ],
    alternates: {
      canonical,
      languages,
    },
    // Social-share metadata: localized to the URL. Sharing /es
    // shows a Spanish preview; sharing /zh shows Chinese; etc.
    openGraph: {
      type: "website",
      url: canonical,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: "OfferShield.pro",
      locale: OG_LOCALES[lang],
      // og:locale:alternate — let crawlers know the page is also
      // available in these other locales.
      // (Next.js 14 doesn't have a direct field for og:locale:alternate
      //  but the hreflang above covers it for search engines.)
      images: [
        {
          url: `${siteUrl}/${lang}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      creator: "@OGDegen",
      site: "@OGDegen",
      images: [`${siteUrl}/${lang}/opengraph-image`],
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default function HomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="pb-20">
          <div className="container">
            <Analyzer />
          </div>
        </section>

        <HowItWorks />
        <Features />
        <Trust />
        <DisclaimerBanner />
      </main>
      <Footer />
      <SeoJsonLd lang={lang} />
    </>
  );
}

/**
 * JSON-LD structured data. We emit two things:
 *   - SoftwareApplication: tells Google this is a real web app
 *   - WebSite + SearchAction: provides sitelinks search box (when
 *     eligible) and a clean site name in SERPs
 *   - FAQPage: surfaces the most common questions as rich results
 *     when Google picks them up
 */
function SeoJsonLd({ lang }: { lang: Locale }) {
  const dict = dictionaries[lang];
  const url = localeUrl(lang);
  const inLanguage = LOCALE_TAG[lang];

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OfferShield",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Contract Analysis",
    operatingSystem: "Web",
    description: dict.meta.description,
    url,
    inLanguage,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "OfferShield",
      url: siteUrl,
    },
    keywords: "contract explainer, offer letter analyzer, MiniMax-M3",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OfferShield",
    url: siteUrl,
    inLanguage,
  };

  // Locale-specific FAQPage. These are the questions people actually
  // search for in each language.
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: faqQuestionsFor(lang).map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}

function faqQuestionsFor(lang: Locale): { q: string; a: string }[] {
  switch (lang) {
    case "es":
      return [
        {
          q: "¿Qué es OfferShield?",
          a: "OfferShield es una aplicación web que utiliza IA para explicar contratos, cartas de oferta, NDAs y acuerdos similares en español claro. Identifica cláusulas de riesgo, obligaciones, fechas clave y preguntas que deberías hacer antes de firmar.",
        },
        {
          q: "¿OfferShield da consejo legal?",
          a: "No. OfferShield ofrece información educativa, no consejo legal. Para decisiones legales importantes, consulta a un abogado colegiado en tu jurisdicción.",
        },
        {
          q: "¿Es seguro usar OfferShield con mis documentos?",
          a: "Sí. El texto de tu documento se envía al modelo solo para generar tu informe y no se almacena. Tu clave de API, si la configuras, nunca llega al navegador.",
        },
        {
          q: "¿Qué tipos de documentos puedo analizar?",
          a: "Cartas de oferta, contratos freelance, NDAs, términos de servicio SaaS, acuerdos con proveedores y otros documentos legales o شبه-legales.",
        },
        {
          q: "¿OfferShield es gratis?",
          a: "Sí, OfferShield se puede usar sin coste. La versión de demostración funciona sin clave de API; con una clave configurada por el operador del sitio, los análisis se generan en tiempo real con el modelo MiniMax-M3.",
        },
      ];
    case "zh":
      return [
        {
          q: "什么是 OfferShield?",
          a: "OfferShield 是一个基于 AI 的 Web 应用,可以用通俗易懂的中文解读合同、Offer、NDA 及类似文档。它会标出风险条款、双方义务、关键日期,以及签署前应提出的问题。",
        },
        {
          q: "OfferShield 提供法律建议吗?",
          a: "不提供。OfferShield 提供的是教育性信息,而非法律建议。涉及重要决定时,请咨询你所在司法管辖区的执业律师。",
        },
        {
          q: "用 OfferShield 分析我的文档安全吗?",
          a: "安全。文档文本仅发送给模型用于生成报告,不会保存。即便配置了 API Key,它也永远不会进入浏览器。",
        },
        {
          q: "可以分析哪些类型的文档?",
          a: "Offer、雇佣合同、自由职业合同、NDA、SaaS 服务条款、供应商协议,以及其他法律或准法律文本。",
        },
        {
          q: "OfferShield 是免费的吗?",
          a: "是的,OfferShield 可以免费使用。演示版无需任何 API Key 即可运行;若站点运营者配置了 Key,则会通过 MiniMax-M3 模型实时生成分析。",
        },
      ];
    case "en":
    default:
      return [
        {
          q: "What is OfferShield?",
          a: "OfferShield is a web app that uses AI to explain contracts, offer letters, NDAs, and similar agreements in plain English. It identifies risky clauses, obligations, key dates, and questions you should consider asking before signing.",
        },
        {
          q: "Does OfferShield give legal advice?",
          a: "No. OfferShield provides educational information, not legal advice. For any decision with real legal consequences, consult a licensed attorney in your jurisdiction.",
        },
        {
          q: "Is it safe to use OfferShield with my documents?",
          a: "Yes. Your document text is sent to the model only to generate your report and is not stored. Your API key, if configured, never reaches the browser.",
        },
        {
          q: "What kinds of documents can I analyze?",
          a: "Offer letters, freelance contracts, NDAs, SaaS terms, vendor agreements, and other legal or quasi-legal texts.",
        },
        {
          q: "Is OfferShield free?",
          a: "Yes, OfferShield is free to use. The demo runs without any API key; with a key configured by the site operator, analyses are generated in real time using the MiniMax-M3 model.",
        },
      ];
  }
}
