import {createFileRoute} from "@tanstack/react-router";
import {getPageImage} from "@/lib/images";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "fumadocs-ui/page";
import browserCollections from "fumadocs-mdx:collections/browser";
import SharedLayout from "@/components/layout/shared/shared-layout";
import {getMDXComponents} from "@/components/mdx-components";
import {Footer} from "@/components/layout/footer/footer";
import {LLMCopyButton} from "@/components/page-actions/llm-copy-button";
import {loader} from "@/lib/server/docs-loader";
import {Suspense, useEffect, useRef} from "react";
import {useFumadocsLoader} from "fumadocs-core/source/client";

export const Route = createFileRoute("/$lang/$")({
  component: Page,
  loader: async ({params}) => {
    const splat = params._splat ?? "";
    const slugs = splat ? splat.split("/") : [];
    const data = await loader({data: {slugs, lang: params.lang}});
    if (slugs[0] !== "api") {
      void clientLoader.preload(data.path);
    }
    return data;
  },
  head: ({loaderData: _loaderData}) => {
    if (!_loaderData) return {};
    const {page} = _loaderData;
    const appName = "Rixl";
    const imageUrl = getPageImage(page.slugs, page.locale).url;

    return {
      meta: [
        {title: `${page.data.title} - ${appName}`},
        {name: "description", content: page.data.description},
        {name: "application-name", content: appName},
        {property: "og:title", content: page.data.title},
        {property: "og:description", content: page.data.description},
        {property: "og:image", content: imageUrl},
        {property: "og:site_name", content: appName},
        {name: "twitter:card", content: "summary_large_image"},
        {name: "twitter:title", content: page.data.title},
        {name: "twitter:description", content: page.data.description},
        {name: "twitter:image", content: imageUrl},
      ],
    };
  },
});

interface LoadedDoc {
  toc: unknown;
  frontmatter: {
    title?: string;
    description?: string;
  };
  default: React.ComponentType<{
    components?: ReturnType<typeof getMDXComponents>;
  }>;
}

interface StaticOpenApiPage {
  toc: unknown;
  html: string;
}

const clientLoader = browserCollections.docs.createClientLoader({
  component: DocsContent,
});

function Page() {
  const {lang, _splat} = Route.useParams();
  const loaderData = Route.useLoaderData() as {
    tree: unknown;
    sectionLinks: {
      home: string;
      sdk: string;
      api: string;
    };
    path: string;
    page: {
      slugs: string[];
      locale: string;
      data: {
        title: string;
        description: string;
      };
    };
    apiPage?: StaticOpenApiPage;
  };
  const data = useFumadocsLoader(loaderData);
  const isApiPage = !!loaderData.apiPage;
  const Content = isApiPage ? undefined : clientLoader.getComponent(loaderData.path);
  const section = _splat?.split("/")[0] ?? "root";

  return (
    <SharedLayout lang={lang} dataTree={data.tree} sectionLinks={loaderData.sectionLinks} treeKey={`${lang}:${section}`}>
      {isApiPage ? <ApiContent apiPage={loaderData.apiPage} page={loaderData.page} /> : Content ? <Content /> : null}
    </SharedLayout>
  );
}

function ApiContent({
  apiPage,
  page,
}: {
  apiPage?: StaticOpenApiPage;
  page: {
    slugs: string[];
    locale: string;
    data: {
      title: string;
      description: string;
    };
  };
}) {
  const {lang, _splat} = Route.useParams();
  if (!apiPage) return null;
  const pageSlug = _splat ?? "";
  const markdownPath = pageSlug ? `/${lang}/${pageSlug}.md` : `/${lang}.md`;
  const githubPath = pageSlug ? `content/${lang}/${pageSlug}` : `content/${lang}`;

  return (
    <DocsPage
      className="api-docs-page max-w-[1280px] pt-4 md:pt-4 xl:pt-4 xl:layout:[--fd-toc-width:460px] 2xl:layout:[--fd-toc-width:520px]"
      full={false}
      toc={(apiPage.toc as never) ?? []}
      tableOfContent={{
        enabled: true,
      }}
      footer={{
        children: <Footer lang={lang} />,
      }}
    >
      <header className="relative space-y-2">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <DocsTitle>{page.data.title}</DocsTitle>
            <LLMCopyButton markdownUrl={markdownPath} githubUrl={`https://github.com/qeeqez/docs/tree/main/${githubPath}`} />
          </div>
        </div>
        <DocsDescription>{page.data.description}</DocsDescription>
      </header>
      <DocsBody>
        <StaticApiHtml html={apiPage.html} />
      </DocsBody>
    </DocsPage>
  );
}

function StaticApiHtml({html}: {html: string}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const toc = document.getElementById("nd-toc");
    const rail = findApiRail(root);
    const hiddenTocChildren: HTMLElement[] = [];
    let railParent: ParentNode | null = null;
    let railNextSibling: ChildNode | null = null;

    const shouldDock = typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches;

    if (toc && rail && shouldDock) {
      for (const child of Array.from(toc.children)) {
        if (child instanceof HTMLElement) {
          hiddenTocChildren.push(child);
          child.style.display = "none";
        }
      }

      railParent = rail.parentNode;
      railNextSibling = rail.nextSibling;
      rail.classList.add("api-toc-rail");
      toc.dataset.apiRail = "true";
      toc.appendChild(rail);
    }

    const panelRoot = rail ?? root;

    const setExpanded = (button: HTMLButtonElement, expanded: boolean) => {
      const panelId = button.getAttribute("aria-controls");
      if (!panelId) return;

      const panel = root.querySelector<HTMLElement>(`#${CSS.escape(panelId)}`);
      if (!panel) return;

      button.setAttribute("aria-expanded", expanded ? "true" : "false");
      button.setAttribute("data-state", expanded ? "open" : "closed");

      const item = button.closest<HTMLElement>("[data-state]");
      item?.setAttribute("data-state", expanded ? "open" : "closed");

      panel.setAttribute("data-state", expanded ? "open" : "closed");
      if (expanded) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    };

    const activateTab = (button: HTMLButtonElement) => {
      const tabList = button.closest<HTMLElement>('[role="tablist"]');
      if (!tabList) return;

      const tabs = tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const tab of tabs) {
        const selected = tab === button;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("data-state", selected ? "active" : "inactive");
        tab.tabIndex = selected ? 0 : -1;

        const panelId = tab.getAttribute("aria-controls");
        if (!panelId) continue;

        const panel = panelRoot.querySelector<HTMLElement>(`#${CSS.escape(panelId)}`);
        if (!panel) continue;

        panel.setAttribute("data-state", selected ? "active" : "inactive");
        if (selected) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>("button");
      if (!button) return;
      const inApiRoot = root.contains(button);
      const inRail = panelRoot !== root && panelRoot.contains(button);
      if (!inApiRoot && !inRail) return;

      if (button.getAttribute("role") === "tab") {
        event.preventDefault();
        activateTab(button);
        return;
      }

      const hasExpanded = button.hasAttribute("aria-expanded");
      const hasPopup = button.hasAttribute("aria-haspopup");
      const isAccordionTrigger = !!button.closest('[data-orientation="vertical"]');
      if (!hasExpanded || hasPopup || !isAccordionTrigger) return;

      event.preventDefault();
      const expanded = button.getAttribute("aria-expanded") === "true";
      setExpanded(button, !expanded);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);

      if (toc) {
        delete toc.dataset.apiRail;
        for (const child of hiddenTocChildren) {
          child.style.removeProperty("display");
        }
      }

      if (rail && railParent) {
        rail.classList.remove("api-toc-rail");
        if (railNextSibling && railParent.contains(railNextSibling)) {
          railParent.insertBefore(rail, railNextSibling);
        } else {
          railParent.appendChild(rail);
        }
      }
    };
  }, [html]);

  return <div ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{__html: html}} />;
}

function findApiRail(root: HTMLElement): HTMLElement | null {
  const tablists = Array.from(root.querySelectorAll<HTMLElement>('[role="tablist"]'));
  const languageTabs = tablists.find((tablist) => {
    const labels = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
      .map((tab) => tab.textContent?.trim().toLowerCase() ?? "")
      .filter(Boolean);

    return labels.includes("curl") && labels.includes("javascript");
  });

  if (languageTabs) {
    const stickyRail = languageTabs.closest<HTMLElement>('[class*="sticky"][class*="top-"]');
    if (stickyRail) {
      return stickyRail;
    }

    const horizontalCard = languageTabs.closest<HTMLElement>('[data-orientation="horizontal"]');
    if (horizontalCard) {
      for (let current: HTMLElement | null = horizontalCard; current && current !== root; current = current.parentElement) {
        if (current.parentElement === root) return current;
      }
    }
  }

  for (const node of root.querySelectorAll<HTMLElement>("div")) {
    if (node.className.includes("@4xl:w-[400px]") && node.querySelector('[role="tablist"]')) {
      return node;
    }
  }

  return null;
}

function DocsContent({toc, frontmatter, default: MDX}: LoadedDoc) {
  const {lang, _splat} = Route.useParams();
  const pageSlug = _splat ?? "";
  const category = getCategoryFromSlug(pageSlug);
  const markdownPath = pageSlug ? `/${lang}/${pageSlug}.md` : `/${lang}.md`;
  const githubPath = pageSlug ? `content/${lang}/${pageSlug}` : `content/${lang}`;

  return (
    <>
      <DocsPage
        className="pt-4 md:pt-4 xl:pt-4"
        full={false}
        toc={toc}
        footer={{
          children: <Footer lang={lang} />,
        }}
      >
        <header className="relative space-y-2">
          <div className="space-y-2.5">
            <p className="text-sm font-medium text-fd-primary">{category}</p>

            <div className="flex items-center justify-between gap-2">
              <DocsTitle>{frontmatter.title}</DocsTitle>
              <LLMCopyButton markdownUrl={markdownPath} githubUrl={`https://github.com/qeeqez/docs/tree/main/${githubPath}`} />
            </div>
          </div>
          <DocsDescription>{frontmatter.description}</DocsDescription>
        </header>
        <DocsBody>
          <Suspense fallback={null}>
            <MDX
              components={getMDXComponents({
                // a: createRelativeLink(source, page), TODO keke
              })}
            />
          </Suspense>
        </DocsBody>
      </DocsPage>
    </>
  );
}

function getCategoryFromSlug(pageSlug: string): string {
  const segments = pageSlug.split("/").filter(Boolean);
  const category = segments[1] ?? segments[0] ?? "Documentation";

  return category
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}
