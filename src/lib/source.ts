import {loader} from "fumadocs-core/source";
import * as icons from "lucide-static";
import {docs} from "fumadocs-mdx:collections/server";
import {i18n} from "@/lib/i18n";
import {createElement} from "react";

export const source = loader({
  i18n,
  baseUrl: "/",
  icon(icon) {
    if (icon && icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource(),
});
