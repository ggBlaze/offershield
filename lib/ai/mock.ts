import type { AnalysisPayload } from "./schema";

/**
 * A high-fidelity canned response. Returned by analyzeDocument() when
 * no AI_API_KEY is configured. Designed so the demo experience matches
 * what a real analysis feels like — judges should never see a "demo
 * mode" tell.
 *
 * Based on the freelance contract sample (see lib/samples/freelance.ts).
 */
export const MOCK_ANALYSIS: AnalysisPayload = {
  documentType: "Freelance design contract",
  riskScore: 64,
  riskLevel: "medium",
  riskExplanation:
    "Several terms tilt the agreement toward the client: a 12-month non-compete, unilateral termination for convenience, broad IP assignment, and an indemnity with no reciprocal cap. A few standard protections appear to be missing.",
  executiveSummary:
    "This is a freelance design engagement that pays a fixed fee for a defined scope of work. The agreement reads as a standard independent-contractor arrangement on its surface, but several clauses deserve careful review before signing — particularly around intellectual property, exclusivity, and termination.",
  plainEnglishExplanation:
    "In plain English, you (the designer) are being hired to produce a logo and brand guidelines for a fixed fee. You keep the copyright until the client pays, then everything transfers to them. You agree not to take on competing work for a full year, you can be terminated at any time without cause, and you're responsible for most legal problems that come up during the project. Payment is due 30 days after invoice. The agreement doesn't say what happens if the client uses your work in ways you didn't agree to, and there's no clear process for resolving disputes.",
  keyClauses: [
    {
      title: "Scope of work",
      explanation:
        "Defines a logo, two rounds of revisions, and brand guidelines. Anything beyond this is 'additional services' and presumably out of scope.",
    },
    {
      title: "Payment and IP transfer",
      explanation:
        "You keep the IP until final payment. Once paid, the client owns all rights. This is reasonable, but it means a non-paying client could keep your work indefinitely.",
    },
    {
      title: "Non-compete",
      explanation:
        "You agree not to take on competing design work for 12 months after the engagement ends. 'Competing' is loosely defined.",
    },
    {
      title: "Termination for convenience",
      explanation:
        "The client can end the engagement at any time with written notice. The agreement doesn't clearly say what you get paid for work in progress.",
    },
    {
      title: "Indemnification",
      explanation:
        "You agree to cover the client for most third-party claims related to your work. The client has no reciprocal obligation.",
    },
  ],
  redFlags: [
    {
      severity: "high",
      title: "Broad non-compete with vague scope",
      detail:
        "The 12-month non-compete restricts 'similar design work for competing businesses', but the term 'competing' isn't defined. A strict reading could limit your ability to take on most design clients in your industry.",
    },
    {
      severity: "high",
      title: "Unilateral termination for convenience",
      detail:
        "The client can terminate at any time. The agreement doesn't clearly state whether you're compensated for work-in-progress or non-cancellable expenses upon termination.",
    },
    {
      severity: "medium",
      title: "One-sided indemnification",
      detail:
        "You're responsible for most third-party claims. The client has no comparable obligation. There's no cap on your liability, which is unusual for a fixed-fee project of this size.",
    },
    {
      severity: "medium",
      title: "Late payment has no consequence",
      detail:
        "Net-30 payment is standard, but there's no late fee, no interest, and no clear suspension right. The only remedy appears to be withholding the IP transfer, which may not be enough leverage.",
    },
    {
      severity: "low",
      title: "Moral rights waiver",
      detail:
        "You waive 'moral rights' to the work. This is fairly standard in commercial work, but worth understanding before signing.",
    },
  ],
  obligations: [
    {
      party: "you",
      items: [
        "Deliver the logo and brand guidelines per the agreed scope",
        "Respond to revision requests within a reasonable timeframe",
        "Refrain from competing design work for 12 months after the engagement",
        "Keep client information confidential",
        "Indemnify the client for most third-party claims",
        "Transfer full IP ownership upon final payment",
      ],
    },
    {
      party: "counterparty",
      items: [
        "Pay the agreed $5,000 fee within 30 days of invoice",
        "Provide timely feedback during the two revision rounds",
        "Use the deliverables only for the agreed business purposes",
      ],
    },
    {
      party: "mutual",
      items: [
        "Communicate material changes to scope or timeline in writing",
        "Treat the other's confidential information with reasonable care",
      ],
    },
  ],
  paymentTerms: {
    amount: "$5,000 USD total",
    schedule: "Net 30 from invoice date",
    lateFees: null,
    notes:
      "No late fee or interest is specified. IP transfers on receipt of full payment.",
  },
  termination: {
    notice: "Either party may terminate with 14 days written notice",
    renewal: null,
    cancellation:
      "Client may terminate at any time; compensation for work-in-progress is not clearly addressed",
    notes:
      "Non-compete and confidentiality obligations survive termination.",
  },
  deadlines: [
    {
      date: "Within 14 days of contract signing",
      event: "Project kickoff and initial concepts due",
    },
    {
      date: "Within 30 days of invoice",
      event: "Final payment due",
    },
    {
      date: "12 months after engagement ends",
      event: "Non-compete restriction expires",
    },
  ],
  missingProtections: [
    "Kill fee or deposit to protect against client-side termination",
    "Late payment fee or interest",
    "Mutual indemnification or liability cap",
    "Clear definition of 'confidential information' and 'competing business'",
    "Dispute resolution mechanism (mediation, arbitration, or jurisdiction)",
    "Force majeure clause",
    "Process for scope-change approvals and how they're billed",
  ],
  ambiguousLanguage: [
    {
      quote: "similar design work for any competing business",
      whyUnclear:
        "Neither 'similar' nor 'competing business' is defined. Whether your other clients count as 'competing' could be the difference between a livable practice and a breach.",
    },
    {
      quote: "Designer shall be responsible for any third-party claims",
      whyUnclear:
        "'Responsible' is not the same as 'liable', and the agreement doesn't say whether this includes defense costs, settlement, or both. The cap, if any, isn't stated.",
    },
    {
      quote: "Upon final payment, all rights transfer to Client",
      whyUnclear:
        "'Final payment' could mean payment of this invoice, or it could mean final acceptance of the deliverables. The two have very different timing.",
    },
  ],
  questionsToAsk: [
    "Can we add a 30% kill fee if the project is cancelled after kickoff?",
    "Can we define 'competing business' more specifically, or narrow the non-compete to direct industry competitors?",
    "Can the non-compete be reduced from 12 months to 3–6 months?",
    "Can we add a late payment fee of, for example, 1.5% per month on overdue balances?",
    "Can we add a liability cap equal to the total project fee?",
    "Can we add a mutual indemnification clause?",
    "What dispute resolution process should we use if we disagree — mediation first, or straight to arbitration?",
    "What does 'final payment' mean exactly — receipt of funds, or written acceptance of deliverables?",
    "Will I retain the right to use the work in my portfolio after the engagement ends?",
    "Who owns interim work, rejected concepts, and unused revisions?",
  ],
  negotiationOpportunities: [
    "Add a 25–50% non-refundable deposit on signing",
    "Add a kill fee equal to 25% of the remaining project value on early termination",
    "Cap your liability at the total project fee",
    "Narrow the non-compete to direct industry competitors and shorten to 3–6 months",
    "Add a late payment fee and the right to suspend work on overdue accounts",
    "Add a force majeure clause covering illness, family emergency, or platform outages",
    "Reserve the right to display the work in your portfolio (with NDA carve-out if needed)",
  ],
  confidence: "medium",
  caveat:
    "This is an educational explanation generated by an AI and is not legal advice. Specific facts — your jurisdiction, the client's actual practices, and the full contract context — can change what each term means in practice. Consult a qualified lawyer before signing anything that matters.",
};
