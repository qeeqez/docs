import {CollapsibleContent} from "fumadocs-ui/components/ui/collapsible";
import type {Collapsible as Primitive} from "radix-ui";
import {useMemo} from "react";
import {SidebarContext, useInternalContext} from "@/components/layout/docs/sidebar/sidebar-provider";
import {cn} from "@/lib/cn";

export function SidebarFolderContent(props: Primitive.CollapsibleContentProps) {
  const {level, ...ctx} = useInternalContext();

  return (
    <CollapsibleContent
      {...props}
      className={cn(
        "relative",
        level === 1 && [
          "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5",
          "**:data-[active=true]:before:content-[''] **:data-[active=true]:before:bg-fd-primary **:data-[active=true]:before:absolute **:data-[active=true]:before:w-px **:data-[active=true]:before:inset-y-2.5 **:data-[active=true]:before:start-2.5",
        ],
        props.className,
      )}
      style={
        {
          "--sidebar-item-offset": `calc(var(--spacing) * ${(level + 1) * 3})`,
          ...props.style,
        } as object
      }
    >
      <SidebarContext.Provider
        value={useMemo(
          () => ({
            ...ctx,
            level: level + 1,
          }),
          [ctx, level],
        )}
      >
        {props.children}
      </SidebarContext.Provider>
    </CollapsibleContent>
  );
}
