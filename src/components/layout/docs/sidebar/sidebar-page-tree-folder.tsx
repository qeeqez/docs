"use client";

import type {Folder} from "fumadocs-core/page-tree";
import {useTreePath} from "fumadocs-ui/contexts/tree";
import type {ReactNode} from "react";
import {SidebarFolder} from "./sidebar-folder";
import {SidebarFolderContent} from "./sidebar-folder-content";
import {SidebarFolderLink} from "./sidebar-folder-link";
import {SidebarFolderTrigger} from "./sidebar-folder-trigger";
import {useInternalContext} from "./sidebar-provider";

export function PageTreeFolder({item, ...props}: {item: Folder; children: ReactNode}) {
  const {defaultOpenLevel, level} = useInternalContext();
  const path = useTreePath();
  const active = path.includes(item);

  return (
    <SidebarFolder defaultOpen={(item.defaultOpen ?? defaultOpenLevel >= level) || active}>
      {item.index ? (
        <SidebarFolderLink href={item.index.url} external={item.index.external} active={active} {...props}>
          {item.icon}
          <span className="min-w-0 flex-1 truncate whitespace-nowrap">{item.name}</span>
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger active={active} {...props}>
          {item.icon}
          <span className="min-w-0 flex-1 truncate whitespace-nowrap">{item.name}</span>
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{props.children}</SidebarFolderContent>
    </SidebarFolder>
  );
}
