import { freelanceContract } from "./freelance";
import { jobOfferLetter } from "./offerLetter";
import { mutualNda } from "./nda";

export interface SampleDoc {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  text: string;
}

export const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: "freelance",
    label: "Freelance contract",
    shortLabel: "Freelance",
    description:
      "A freelance design engagement with a few clauses worth a second look.",
    text: freelanceContract,
  },
  {
    id: "offer-letter",
    label: "Job offer letter",
    shortLabel: "Offer letter",
    description:
      "A senior designer offer with broad IP and post-termination restrictions.",
    text: jobOfferLetter,
  },
  {
    id: "nda",
    label: "Mutual NDA",
    shortLabel: "NDA",
    description:
      "A mutual NDA with a long term, a residuals clause, and broad carve-outs.",
    text: mutualNda,
  },
];

export function getSampleById(id: string): SampleDoc | undefined {
  return SAMPLE_DOCS.find((s) => s.id === id);
}
