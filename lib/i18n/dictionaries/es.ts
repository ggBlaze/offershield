import type { Dictionary } from "../dictionaries";

export const es: Dictionary = {
  meta: {
    title: "OfferShield — Entiende los contratos antes de firmar",
    description:
      "OfferShield convierte textos legales densos en resúmenes en español claro, alertas de riesgo, obligaciones y preguntas inteligentes que hacer. Hecho con cariño usando MiniMax-M3.",
  },
  nav: {
    howItWorks: "Cómo funciona",
    features: "Funciones",
    disclaimer: "Aviso legal",
    status: "Estado",
  },
  hero: {
    badge: "Explicador de contratos con IA",
    h1Before: "Entiende los contratos",
    h1Highlight: "antes de firmar.",
    subhead:
      "OfferShield convierte textos legales densos en resúmenes claros, alertas de riesgo, obligaciones y preguntas inteligentes que hacer — ",
    subheadHighlight: "hecho con cariño usando MiniMax-M3",
    ctaPrimary: "Probar un ejemplo",
    ctaSecondary: "Pegar tu documento",
    private:
      "Privado por defecto — el texto se analiza solo para generar tu informe",
    educational: "Información educativa, no consejo legal",
  },
  howItWorks: {
    tag: "Cómo funciona",
    title: "Tres pasos. Cerca de un minuto.",
    steps: [
      {
        title: "Pega o sube",
        body:
          "Pega un contrato, carta de oferta, NDA o cualquier documento — texto o PDF. O prueba con un ejemplo incluido.",
      },
      {
        title: "Haz clic en analizar",
        body:
          "OfferShield lee el documento, identifica las cláusulas clave y detecta los riesgos en pocos segundos.",
      },
      {
        title: "Lee tu informe",
        body:
          "Recibe una explicación clara, alertas, obligaciones y preguntas que hacer antes de firmar.",
      },
    ],
  },
  features: {
    tag: "Qué obtienes",
    title: "Diseñado para ayudarte a tomar mejores decisiones.",
    items: [
      {
        title: "Explicaciones en español claro",
        body:
          "Un recorrido tranquilo por lo que el documento realmente dice — sin jerga legal.",
      },
      {
        title: "Alertas de riesgo accionables",
        body:
          "Gravedad codificada por colores para cada preocupación, con la cláusula específica de la que proviene.",
      },
      {
        title: "Fechas y obligaciones clave",
        body:
          "Plazos, renovaciones y lo que cada parte debe — extraído y presentado con claridad.",
      },
      {
        title: "Preguntas inteligentes que hacer",
        body:
          "Una lista copiable de preguntas específicas y útiles para la otra parte o tu abogado.",
      },
      {
        title: "Varios tipos de documento",
        body:
          "Cartas de oferta, contratos freelance, NDAs, términos SaaS, acuerdos con proveedores y más.",
      },
      {
        title: "Privado por defecto",
        body:
          "Tu texto solo se usa para generar el informe. No se guarda nada.",
      },
    ],
  },
  trust: {
    items: [
      {
        title: "Privado por defecto",
        body:
          "El texto del documento se envía al modelo solo para generar tu informe. No se guarda nada.",
      },
      {
        title: "IA en el servidor",
        body:
          "Todo el análisis se ejecuta en el servidor. Tu clave de API, si está configurada, nunca llega al navegador.",
      },
      {
        title: "Sin registro",
        body:
          "Abre la app y úsala. Sin cuenta, sin email, sin fricción.",
      },
    ],
  },
  disclaimer: {
    title:
      "OfferShield ofrece información educativa, no consejo legal.",
    body:
      "El análisis que recibes lo genera una IA y está pensado para ayudarte a entender un documento, no para reemplazar a un abogado cualificado. Los hechos específicos — tu jurisdicción, las prácticas de la otra parte y el contexto completo del contrato — pueden cambiar lo que cada cláusula significa en la práctica. Para cualquier decisión con consecuencias reales, consulta a un abogado colegiado en tu jurisdicción.",
  },
  footer: {
    copyright: (year: number) => `© ${year} OfferShield`,
    by: "por",
    creditAria: "Blaze en X (se abre en una pestaña nueva)",
    builtWith: "Hecho con",
    using: "usando",
    model: "MiniMax-M3",
  },
  analyzer: {
    trust:
      "Privado por defecto · no se guarda · se analiza solo para generar tu informe",
    tabs: {
      paste: "Pegar texto",
      upload: "Subir PDF",
      sample: "Probar un ejemplo",
    },
    paste: {
      placeholder:
        "Pega aquí tu contrato, carta de oferta, NDA o cualquier documento…",
      charCounter: (count: number, max: number) =>
        `${count.toLocaleString("es-ES")} / ${max.toLocaleString("es-ES")} caracteres`,
      charCounterWithMeta: (count: number, max: number, words: number, mins: number) =>
        `${count.toLocaleString("es-ES")} / ${max.toLocaleString("es-ES")} caracteres · ${words.toLocaleString("es-ES")} palabras · ~${mins} min de lectura`,
      tooShort: (min: number) =>
        `Añade un poco más — al menos ${min} caracteres.`,
      tooLong: (max: number) =>
        `Demasiado largo. Recorta a ${max.toLocaleString("es-ES")} caracteres.`,
    },
    upload: {
      dropZone: "Suelta un PDF aquí, o haz clic para elegir",
      replace: "Reemplazar archivo",
      hint: "Hasta 4,5 MB. Los PDFs con texto funcionan mejor.",
      tooLarge: "El archivo es demasiado grande. Máximo 4,5 MB.",
      wrongType: "Por favor, elige un archivo PDF.",
      removeFile: "Quitar archivo",
    },
    sample: {
      prompt:
        "Elige un ejemplo para ver cómo funciona OfferShield — sin subir ni pegar nada.",
      loaded: "Ejemplo cargado. Listo para analizar.",
    },
    button: {
      analyze: "Analizar documento",
      analyzing: "Analizando…",
    },
    inline:
      "OfferShield ofrece información educativa, no consejo legal.",
  },
  analyzing: {
    messages: [
      "Leyendo tu documento…",
      "Identificando cláusulas clave…",
      "Detectando alertas de riesgo…",
      "Mapeando obligaciones…",
      "Redactando preguntas que hacer…",
      "Calculando la puntuación de riesgo…",
    ],
    etaPrefix: "ETA:",
    etaRange: (lo: number, hi: number) => `${lo}–${hi} min`,
    etaMinutes: (n: number) => `${n} min`,
    etaSeconds: (n: number) => `${n} s`,
    etaFinishing: "Casi listo…",
  },
  errorState: {
    title: "Algo salió mal",
    retry: "Reintentar",
  },
  report: {
    heading: {
      tag: "Tu informe",
      title: "Lee antes de firmar",
      generatedBy: "Generado por OfferShield",
    },
    download: {
      title: "Guarda este informe",
      subtitle:
        "Descarga una copia para tus registros, para compartir con un abogado o para imprimir.",
      htmlButton: "Guardar como HTML",
      markdownButton: "Guardar como Markdown",
      generating: "Preparando…",
    },
    risk: {
      tag: "Riesgo general",
      outOf: (score: number) => ` / 100`,
    },
    exec: {
      tag: "Resumen ejecutivo",
      fallback: "Contrato",
    },
    plain: {
      tag: "Explicación en español claro",
      title: "Lee antes de firmar",
    },
    clauses: {
      tag: "Cláusulas clave",
      title: "Lo que hacen las principales cláusulas",
    },
    redFlags: {
      tag: "Alertas de riesgo",
      title: "Vale la pena revisarlas",
      emptyTitle: "No se detectaron alertas importantes",
      emptyBody:
        "Según este análisis, el documento no contiene cláusulas que claramente requieran precaución. Aun así, deberías leer el acuerdo y considerar consultar a un abogado sobre cualquier cosa que no entiendas del todo.",
    },
    obligations: {
      tag: "Obligaciones",
      title: "Quién debe qué",
      you: "Tus obligaciones",
      counterparty: "Obligaciones de la otra parte",
      mutual: "Obligaciones mutuas",
    },
    payment: {
      tag: "Pago y compensación",
      title: "El lado económico",
      amount: "Importe",
      schedule: "Calendario",
      lateFees: "Intereses de demora",
      notes: "Notas",
    },
    termination: {
      tag: "Terminación y renovación",
      title: "Cómo termina el acuerdo",
      notice: "Preaviso necesario",
      renewal: "Renovación",
      cancellation: "Cancelación",
      notes: "Notas",
    },
    deadlines: {
      tag: "Plazos y fechas importantes",
      title: "No te pierdas estas fechas",
    },
    missing: {
      tag: "Protecciones que faltan",
      title: "Lo que este acuerdo no cubre",
    },
    ambiguous: {
      tag: "Lenguaje ambiguo",
      title: "Frases que conviene aclarar",
      why: "Por qué no está claro: ",
    },
    questions: {
      tag: "Preguntas que hacer",
      title: "Antes de firmar",
      copy: "Copiar todo",
      copied: "Copiado",
      copyAria: "Copiar todas las preguntas",
    },
    negotiation: {
      tag: "Oportunidades de negociación",
      title: "Cosas concretas para negociar",
    },
    confidence: {
      tag: "Confianza y advertencia",
      title: "Cuánto fiarte de esto",
      educational: "Educativo, no consejo legal",
    },
    disclaimer: {
      title:
        "OfferShield ofrece información educativa, no consejo legal.",
      body:
        "El análisis de arriba lo genera una IA y está pensado para ayudarte a entender un documento, no para reemplazar a un abogado. Para cualquier decisión con consecuencias reales, consulta a un abogado colegiado en tu jurisdicción.",
    },
    documentType: (t: string) => `${t} · Confianza: `,
  },
};
