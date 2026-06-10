import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center mb-12 space-y-3">
          <Skeleton className="h-3 w-24 mx-auto" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
