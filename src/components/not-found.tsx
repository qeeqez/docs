"use client";

import {ChevronLeftIcon, HomeIcon} from "lucide-react";
import {Link, useRouter} from "@tanstack/react-router";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/cn";

export function NotFound() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 min-h-[40rem]">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-lg max-w-lg mx-auto leading-relaxed text-fd-muted-foreground">We couldn't find the page you were looking for.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/" className={cn(buttonVariants({variant: "primary"}))}>
            <HomeIcon />
            Return Home
          </Link>

          <button type="button" onClick={() => router.history.back()} className={cn(buttonVariants({variant: "outline"}))}>
            <ChevronLeftIcon />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
