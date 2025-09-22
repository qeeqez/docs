"use client";

import type {PageTree} from "fumadocs-core/server";
import type {FC, ReactNode} from "react";

export interface SidebarComponents {
  Item: FC<{ item: PageTree.Item }>;
  Folder: FC<{ item: PageTree.Folder; level: number; children: ReactNode }>;
  Separator: FC<{ item: PageTree.Separator }>;
}