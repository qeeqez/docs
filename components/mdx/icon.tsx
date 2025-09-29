import React, { ComponentProps, ReactElement } from "react";
import { icons, type LucideProps } from "lucide-react";
import {cn} from "@/lib/cn";

const toPascalCase = (str: string): string =>
    str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");

const ICON_MAPPINGS: Record<string, string> = {
    "bar-chart": "ChartBar",
    "bar-chart-3": "ChartColumn",
    "line-chart": "ChartLine",
    "pie-chart": "ChartPie",
    "area-chart": "ChartArea",
    "scatter-chart": "ChartScatter",
    "gantt-chart": "ChartGantt",
    "alert-triangle": "TriangleAlert",
    "check-circle": "CircleCheck",
    "check-square": "SquareCheck",
    "book-open": "BookOpen",
    "file-text": "FileText",
    "file-type": "FileType",
    "file-video": "FileVideo",
    "folder-open": "FolderOpen",
    "folder-plus": "FolderPlus",
    "git-branch": "GitBranch",
    "graduation-cap": "GraduationCap",
    "hard-drive": "HardDrive",
    "layout-dashboard": "LayoutDashboard",
    "message-circle": "MessageCircle",
    "refresh-cw": "RefreshCw",
    "rotate-ccw": "RotateCcw",
    "share-2": "Share2",
    "shopping-cart": "ShoppingCart",
    "trending-up": "TrendingUp",
    "user-check": "UserCheck",
    "volume-2": "Volume2",
};

type IconProps =
    | ({
    name: string;
    icon?: never;
} & Omit<LucideProps, "name">)
    | ({
    name?: never;
    icon: ReactElement;
} & Omit<LucideProps, "name">);

export const Icon = ({name, icon, ...props}: IconProps) => {
    if (icon) return React.cloneElement(icon, props);

    if (name) {
        const mapped = ICON_MAPPINGS[name];
        const candidates = [
            mapped,
            name,
            toPascalCase(name),
            name.charAt(0).toUpperCase() + name.slice(1),
            name.toLowerCase(),
        ].filter(Boolean) as string[];

        for (const candidate of candidates) {
            const LucideIcon =
                icons[candidate as keyof typeof icons] ?? undefined;
            if (LucideIcon) return <LucideIcon {...props} />;
        }
    }

    return <FallbackIcon {...props} />;
};

const FallbackIcon = (props: ComponentProps<"svg">) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width ?? 24}
        height={props.height ?? 24}
        viewBox="0 0 24 24"
        className={cn("lucide", props.className)}
        {...props}
    />
);