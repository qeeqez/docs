import {ChevronDown} from "lucide-react";
import type {Collapsible as Primitive} from "radix-ui";
import {useFolderContext} from "@/components/layout/docs/sidebar/sidebar-folder";
import {sidebarItemVariants} from "@/components/layout/docs/sidebar/sidebar-item";
import {CollapsibleTrigger} from "@/components/ui/collapsible";
import {cn} from "@/lib/cn";

export function SidebarFolderTrigger({className, active = false, ...props}: Primitive.CollapsibleTriggerProps & {active?: boolean}) {
  const {open} = useFolderContext();

  return (
    <CollapsibleTrigger data-active={active} className={cn(sidebarItemVariants({active}), "w-full", className)} {...props}>
      {props.children}
      <ChevronDown data-icon className={cn("ms-auto transition-transform", !open && "-rotate-90")} />
    </CollapsibleTrigger>
  );
}
