"use client";

import type {Folder, Item, Separator} from "fumadocs-core/page-tree";
import type {FC, ReactNode} from "react";

export interface SidebarComponents {
  Item: FC<{item: Item}>;
  Folder: FC<{item: Folder; level: number; children: ReactNode}>;
  Separator: FC<{item: Separator}>;
}
