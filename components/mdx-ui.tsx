'use client';

import {AlertCircle, AlertTriangle, CheckCircle, Info} from "lucide-react";

interface CalloutProps {
  type: 'tip' | 'info' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

/**
 * Callout - Theme-aware alert component with semantic colors
 * Provides proper contrast ratios and accessibility for all themes
 */
export const Callout = ({type, title, children}: CalloutProps) => {
  const config = {
    tip: {
      icon: CheckCircle,
      bgClass: 'bg-green-50 dark:bg-green-950/30',
      borderClass: 'border-green-200 dark:border-green-800',
      textClass: 'text-green-800 dark:text-green-200',
      iconClass: 'text-green-600 dark:text-green-400'
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-50 dark:bg-blue-950/30',
      borderClass: 'border-blue-200 dark:border-blue-800',
      textClass: 'text-blue-800 dark:text-blue-200',
      iconClass: 'text-blue-600 dark:text-blue-400'
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-yellow-50 dark:bg-yellow-950/30',
      borderClass: 'border-yellow-200 dark:border-yellow-800',
      textClass: 'text-yellow-800 dark:text-yellow-200',
      iconClass: 'text-yellow-600 dark:text-yellow-400'
    },
    warn: {
      icon: AlertTriangle,
      bgClass: 'bg-yellow-50 dark:bg-yellow-950/30',
      borderClass: 'border-yellow-200 dark:border-yellow-800',
      textClass: 'text-yellow-800 dark:text-yellow-200',
      iconClass: 'text-yellow-600 dark:text-yellow-400'
    },
    error: {
      icon: AlertCircle,
      bgClass: 'bg-red-50 dark:bg-red-950/30',
      borderClass: 'border-red-200 dark:border-red-800',
      textClass: 'text-red-800 dark:text-red-200',
      iconClass: 'text-red-600 dark:text-red-400'
    }
  };

  const {icon: IconComponent, bgClass, borderClass, textClass, iconClass} = config[type] || config.info;

  return (
    <div className={`rounded-lg border p-4 my-4 transition-colors ${bgClass} ${borderClass} ${textClass}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconClass}`}/>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-2 text-current">{title}</h4>
          )}
          <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};