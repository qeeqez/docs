'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  X,
  BookOpen,
  Settings,
  Users,
  FileText,
  Code,
  Video,
  Image,
  Music,
  GraduationCap,
  Shield,
  Building,
  Key,
  FolderPlus,
  MessageCircle,
  Activity,
  UserPlus,
  Mail,
  Lock,
  Upload,
  FolderIcon,
  Tag,
  Trash2,
  Search,
  CreditCard,
  Receipt,
  ImageIcon,
  Layers,
  Palette,
  FileType,
  Workflow,
  Archive,
  ShoppingBag,
  Smartphone,
  HelpCircle
} from 'lucide-react';

// Icon mapping object
const iconMap = {
  BookOpen,
  Settings,
  Users,
  FileText,
  Code,
  Video,
  Image,
  Music,
  GraduationCap,
  Shield,
  Building,
  Key,
  FolderPlus,
  MessageCircle,
  Activity,
  UserPlus,
  Mail,
  Lock,
  Upload,
  FolderIcon,
  Tag,
  Trash2,
  Search,
  CreditCard,
  Receipt,
  ImageIcon,
  Layers,
  Palette,
  FileType,
  Workflow,
  Archive,
  ShoppingBag,
  Smartphone,
  HelpCircle,
  ArrowUpRight,
  CheckCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  X
} as const;

type IconName = keyof typeof iconMap;

interface InteractiveCardProps {
  title: string;
  description: string;
  href?: string;
  icon?: IconName;
}

/**
 * InteractiveCard - Theme-aware card component with hover effects and accessibility
 * Supports both dark and light modes with smooth transitions
 */
export const InteractiveCard = ({ title, description, href, icon }: InteractiveCardProps) => {
  const IconComponent = (icon && (iconMap as Record<string, any>)[icon]) ? (iconMap as Record<string, any>)[icon] : ArrowUpRight; // Default to ArrowUpRight if none provided
  
  const CardContent = () => (
    <>
      {icon && IconComponent && (
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-fd-primary/10 dark:bg-fd-primary/20 rounded-lg transition-colors">
            <IconComponent className="h-5 w-5 text-fd-primary" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-fd-muted-foreground group-hover:text-fd-primary transition-colors duration-200" />
        </div>
      )}
      {!icon && (
        <div className="flex items-start justify-between mb-3">
          <ArrowUpRight className="h-4 w-4 text-fd-muted-foreground group-hover:text-fd-primary transition-colors duration-200 ml-auto" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-fd-foreground mb-2 group-hover:text-fd-primary transition-colors duration-200">
        {title}
      </h3>
      <p className="text-fd-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </>
  );

  const baseClasses = "group relative bg-fd-card rounded-xl border border-fd-border p-4 sm:p-6 hover:border-fd-primary/30 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-fd-primary focus-within:ring-offset-2 focus-within:ring-offset-fd-background";

  if (href) {
    return (
      <a 
        href={href} 
        className={`${baseClasses} cursor-pointer hover:-translate-y-1 block no-underline`}
        aria-label={`Navigate to ${title}`}
      >
        <CardContent />
      </a>
    );
  }

  return (
    <div className={baseClasses}>
      <CardContent />
    </div>
  );
};

interface InfoCardProps {
  title: string;
  description: string;
  icon?: IconName;
  children?: React.ReactNode;
}

/**
 * InfoCard - Static information card with theme-aware styling
 * Used for displaying non-interactive content with consistent visual hierarchy
 */
export const InfoCard = ({ title, description, icon, children }: InfoCardProps) => {
  // Resolve icon defensively: if icon is provided but not found in iconMap, fall back to Info
  const IconComponent = (icon && (iconMap as Record<string, any>)[icon]) ? (iconMap as Record<string, any>)[icon] : Info; // Default to Info icon if none provided
  
  return (
    <div className="bg-fd-muted/30 dark:bg-fd-muted/20 rounded-xl border border-fd-border p-4 sm:p-6 transition-colors">
      {IconComponent && (
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-fd-background rounded-lg border border-fd-border shadow-sm">
            <IconComponent className="h-5 w-5 text-fd-muted-foreground" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-fd-foreground mb-2">{title}</h3>
      <p className="text-fd-muted-foreground text-sm leading-relaxed">{description}</p>
      {children && (
        <div className="mt-3 text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      )}
    </div>
  );
};

interface CalloutProps {
  type: 'tip' | 'info' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

/**
 * Callout - Theme-aware alert component with semantic colors
 * Provides proper contrast ratios and accessibility for all themes
 */
export const Callout = ({ type, title, children }: CalloutProps) => {
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

  const { icon: IconComponent, bgClass, borderClass, textClass, iconClass } = config[type] || config.info;
  
  return (
    <div className={`rounded-lg border p-4 my-4 transition-colors ${bgClass} ${borderClass} ${textClass}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconClass}`} />
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