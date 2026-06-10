import type { AnalysisPayload } from "../schema";

/**
 * Spanish mock — based on the freelance contract sample, but written
 * as if the user is reading in Spanish regardless of the language of
 * the source document.
 */
export const MOCK_ES: AnalysisPayload = {
  documentType: "Contrato de diseño freelance",
  riskScore: 64,
  riskLevel: "medium",
  riskExplanation:
    "Varias cláusulas inclinan el acuerdo hacia el cliente: una cláusula de no competencia de 12 meses, terminación unilateral a conveniencia, cesión amplia de propiedad intelectual y una indemnización sin tope recíproco. Faltan algunas protecciones estándar.",
  executiveSummary:
    "Es un encargo de diseño freelance que paga una tarifa fija por un alcance definido. En principio parece un contrato estándar de trabajo autónomo, pero varias cláusulas merecen una revisión cuidadosa antes de firmar — especialmente las de propiedad intelectual, exclusividad y terminación.",
  plainEnglishExplanation:
    "En español claro: a ti (la persona diseñadora) te contratan para producir un logotipo y un manual de marca a cambio de una tarifa fija. Conservas los derechos de autor hasta que el cliente pague; después, todo se le transfiere. Aceptas no tomar trabajos competidores durante un año entero, te pueden despedir en cualquier momento sin causa justificada y tú eres responsable de la mayoría de los problemas legales que surjan durante el proyecto. El pago vence a 30 días de la factura. El contrato no dice qué pasa si el cliente usa tu trabajo de formas no acordadas, y no hay un proceso claro para resolver disputas.",
  keyClauses: [
    {
      title: "Alcance del trabajo",
      explanation:
        "Define un logotipo, dos rondas de revisiones y un manual de marca. Cualquier cosa fuera de esto se considera 'servicios adicionales' y, en principio, queda fuera del alcance.",
    },
    {
      title: "Pago y cesión de propiedad intelectual",
      explanation:
        "Conservas la PI hasta el pago final. Una vez pagado, el cliente es dueño de todos los derechos. Es razonable, pero significa que un cliente que no paga podría conservar tu trabajo indefinidamente.",
    },
    {
      title: "Cláusula de no competencia",
      explanation:
        "Aceptas no tomar trabajos de diseño competidores durante 12 meses tras finalizar el encargo. 'Competidor' está definido de forma ambigua.",
    },
    {
      title: "Terminación a conveniencia",
      explanation:
        "El cliente puede dar por terminado el encargo en cualquier momento con aviso por escrito. El contrato no aclara claramente qué te pagan por el trabajo en curso.",
    },
    {
      title: "Indemnización",
      explanation:
        "Aceptas cubrir al cliente por la mayoría de las reclamaciones de terceros relacionadas con tu trabajo. El cliente no tiene una obligación recíproca.",
    },
  ],
  redFlags: [
    {
      severity: "high",
      title: "Cláusula de no competencia amplia y con alcance difuso",
      detail:
        "La cláusula de 12 meses restringe 'trabajos de diseño similares para negocios competidores', pero el término 'competidor' no está definido. Una lectura estricta podría limitar tu capacidad de aceptar a la mayoría de tus clientes del sector.",
    },
    {
      severity: "high",
      title: "Terminación unilateral a conveniencia",
      detail:
        "El cliente puede terminar el contrato en cualquier momento. El contrato no aclara con claridad si te compensan por el trabajo en curso o por gastos no cancelables al hacerlo.",
    },
    {
      severity: "medium",
      title: "Indemnización desigual",
      detail:
        "Eres responsable de la mayoría de las reclamaciones de terceros. El cliente no tiene una obligación comparable. No hay tope a tu responsabilidad, algo inusual para un proyecto de tarifa fija de este tamaño.",
    },
    {
      severity: "medium",
      title: "Pago tardío sin consecuencia",
      detail:
        "Pago a 30 días es estándar, pero no hay penalización por retraso, ni intereses, ni un derecho claro a suspender el trabajo. El único recurso parece ser retener la cesión de PI, lo que quizá no sea suficiente palanca.",
    },
    {
      severity: "low",
      title: "Renuncia a derechos morales",
      detail:
        "Renuncias a los 'derechos morales' sobre la obra. Es bastante estándar en trabajo comercial, pero conviene entenderlo antes de firmar.",
    },
  ],
  obligations: [
    {
      party: "you",
      items: [
        "Entregar el logotipo y el manual de marca según el alcance acordado",
        "Responder a las solicitudes de revisión en un plazo razonable",
        "Abstenerse de realizar trabajos de diseño competidores durante 12 meses tras el encargo",
        "Mantener la confidencialidad de la información del cliente",
        "Indemnizar al cliente por la mayoría de las reclamaciones de terceros",
        "Transferir la propiedad intelectual completa al recibir el pago final",
      ],
    },
    {
      party: "counterparty",
      items: [
        "Pagar los 5.000 USD acordados en un plazo de 30 días desde la factura",
        "Proporcionar retroalimentación oportuna durante las dos rondas de revisiones",
        "Usar las entregas únicamente para los fines comerciales acordados",
      ],
    },
    {
      party: "mutual",
      items: [
        "Comunicar por escrito cualquier cambio material en el alcance o los plazos",
        "Tratar la información confidencial de la otra parte con cuidado razonable",
      ],
    },
  ],
  paymentTerms: {
    amount: "5.000 USD en total",
    schedule: "Neto a 30 días desde la fecha de la factura",
    lateFees: null,
    notes:
      "No se especifican penalización ni intereses por retraso. La PI se transfiere al recibir el pago completo.",
  },
  termination: {
    notice: "Cualquiera de las partes puede terminar con 14 días de aviso por escrito",
    renewal: null,
    cancellation:
      "El cliente puede terminar en cualquier momento; la compensación por el trabajo en curso no se aborda con claridad",
    notes:
      "Las obligaciones de no competencia y confidencialidad sobreviven a la terminación.",
  },
  deadlines: [
    {
      date: "Dentro de los 14 días posteriores a la firma",
      event: "Inicio del proyecto y entrega de los primeros conceptos",
    },
    {
      date: "Dentro de los 30 días posteriores a la factura",
      event: "Vencimiento del pago final",
    },
    {
      date: "12 meses después de finalizado el encargo",
      event: "Caducidad de la cláusula de no competencia",
    },
  ],
  missingProtections: [
    "Tarifa de cancelación o anticipo que te proteja ante una terminación por parte del cliente",
    "Penalización o intereses por pago tardío",
    "Indemnización mutua o tope de responsabilidad",
    "Definición clara de 'información confidencial' y 'negocio competidor'",
    "Mecanismo de resolución de disputas (mediación, arbitraje o jurisdicción)",
    "Cláusula de fuerza mayor",
    "Proceso para aprobar cambios de alcance y cómo se facturan",
  ],
  ambiguousLanguage: [
    {
      quote: "trabajos de diseño similares para cualquier negocio competidor",
      whyUnclear:
        "Ni 'similar' ni 'negocio competidor' están definidos. Que tus otros clientes cuenten como 'competencia' puede ser la diferencia entre una práctica sostenible y un incumplimiento.",
    },
    {
      quote: "El Diseñador será responsable de cualquier reclamación de terceros",
      whyUnclear:
        "'Responsable' no es lo mismo que 'liable' (legalmente responsable), y el contrato no dice si esto incluye costes de defensa, acuerdos extrajudiciales o ambos. El tope, si existe, no se establece.",
    },
    {
      quote: "Tras el pago final, todos los derechos se transfieren al Cliente",
      whyUnclear:
        "'Pago final' podría significar el pago de esta factura, o podría significar la aceptación final de las entregas. Los dos tienen plazos muy distintos.",
    },
  ],
  questionsToAsk: [
    "¿Podemos añadir una tarifa de cancelación del 30% si el proyecto se cancela tras el inicio?",
    "¿Podemos definir 'negocio competidor' con más precisión, o limitar la cláusula de no competencia a competidores directos del sector?",
    "¿Se puede reducir la cláusula de no competencia de 12 meses a 3–6 meses?",
    "¿Podemos añadir una penalización por pago tardío, por ejemplo del 1,5% mensual sobre saldos vencidos?",
    "¿Podemos añadir un tope de responsabilidad igual al importe total del proyecto?",
    "¿Podemos añadir una cláusula de indemnización mutua?",
    "¿Qué proceso de resolución de disputas deberíamos usar si no nos ponemos de acuerdo — mediación primero, o ir directo a arbitraje?",
    "¿Qué significa exactamente 'pago final' — la recepción de los fondos o la aceptación por escrito de las entregas?",
    "¿Conservaré el derecho a mostrar el trabajo en mi portafolio tras finalizar el encargo?",
    "¿De quién es la propiedad del trabajo intermedio, los conceptos rechazados y las revisiones no utilizadas?",
  ],
  negotiationOpportunities: [
    "Añadir un anticipo no reembolsable del 25–50% al firmar",
    "Añadir una tarifa de cancelación equivalente al 25% del valor restante del proyecto si se termina antes de tiempo",
    "Establecer un tope a tu responsabilidad igual al importe total del proyecto",
    "Restringir la cláusula de no competencia a competidores directos del sector y acortarla a 3–6 meses",
    "Añadir una penalización por pago tardío y el derecho a suspender el trabajo en cuentas morosas",
    "Añadir una cláusula de fuerza mayor que cubra enfermedad, emergencias familiares o caídas de plataformas",
    "Reservar el derecho a mostrar el trabajo en tu portafolio (con la salvedad del NDA si fuera necesario)",
  ],
  confidence: "medium",
  caveat:
    "Esta es una explicación educativa generada por una IA y no constituye consejo legal. Hechos concretos — tu jurisdicción, las prácticas reales del cliente y el contexto completo del contrato — pueden cambiar lo que cada cláusula significa en la práctica. Consulta a un abogado cualificado antes de firmar cualquier cosa que sea importante.",
};
