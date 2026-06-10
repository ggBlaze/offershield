import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container py-24">
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-10 flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-muted-foreground ring-1 ring-white/10">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
                The page you're looking for doesn't exist. Head back to the
                homepage to try OfferShield.
              </p>
            </div>
            <Button asChild>
              <Link href="/">Back to OfferShield</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
