import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Trust } from "@/components/sections/Trust";
import { DisclaimerBanner } from "@/components/sections/DisclaimerBanner";
import { Analyzer } from "@/components/analyzer/Analyzer";

export default function HomePage() {
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
    </>
  );
}
