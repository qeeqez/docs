"use client";

import {ChevronLeftIcon, HomeIcon} from "lucide-react";
import Link from 'next/link'
import {useRouter} from "next/navigation";
import {buttonVariants} from '@/components/ui/button'
import {cn} from "@/lib/cn";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 min-h-160">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-6xl font-bold">
          404
        </h1>
        <h2 className="text-2xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-lg max-w-lg mx-auto leading-relaxed text-fd-muted-foreground">
          We couldn't find the page you were looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className={cn(buttonVariants({variant: 'primary'}))}
          >
            <HomeIcon />
            Return Home
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className={cn(buttonVariants({variant: 'outline'}))}
          >
            <ChevronLeftIcon />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}