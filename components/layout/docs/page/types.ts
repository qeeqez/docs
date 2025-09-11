import type {PageTree} from "fumadocs-core/server";

export type Item = Pick<PageTree.Item, "name" | "description" | "url">;
