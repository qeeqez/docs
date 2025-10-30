import type {Item as PageTreeItem} from "fumadocs-core/page-tree";

export type Item = Pick<PageTreeItem, "name" | "description" | "url">;
