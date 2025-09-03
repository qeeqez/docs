import {useFolderContext} from "@/components/layout/docs/sidebar/sidebar-folder";
import {CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown} from "lucide-react";
import {cn} from "@/lib/cn";
import {sidebarItemVariants} from "@/components/layout/docs/sidebar/sidebar-item";
import type {Collapsible as Primitive} from 'radix-ui'

export function SidebarFolderTrigger({
                                       className,
                                       ...props
                                     }: Primitive.CollapsibleTriggerProps) {
  const {open} = useFolderContext();

  return (
    <CollapsibleTrigger
      className={cn(sidebarItemVariants({active: false}), 'w-full', className)}
      {...props}
    >
      {props.children}
      <ChevronDown
        data-icon
        className={cn('ms-auto transition-transform', !open && '-rotate-90')}
      />
    </CollapsibleTrigger>
  );
}