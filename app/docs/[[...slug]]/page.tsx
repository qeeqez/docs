import { Sidebar } from "@/components/layout/docs/sidebar/sidebar";
import { source } from "@/lib/source";
import { createDocsPages } from "@/components/page-factory";

const { Page, generateStaticParams, generateMetadata } = createDocsPages({
    source,
    SidebarComponent: Sidebar,
    githubPrefix: "content/docs"
});

export default Page;
export { generateStaticParams, generateMetadata };