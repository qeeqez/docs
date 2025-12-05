import type {LinkItemType} from "@/components/layout/shared";

export function isSecondary(item: LinkItemType): boolean {
  if ("secondary" in item && item.secondary != null) return item.secondary;

  return item.type === "icon";
}
