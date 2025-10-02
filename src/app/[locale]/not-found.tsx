import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md border-border/60 text-center">
        <CardHeader>
          <div className="mb-4 text-6xl font-bold text-primary">404</div>
          <CardTitle className="text-2xl">Page non trouvée</CardTitle>
          <CardDescription>
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="default" className="w-full">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

