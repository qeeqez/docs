import { Sidebar } from "@/components/layout/docs/sidebar/sidebar";
import { sdkSource } from "@/lib/source";
import { createDocsPages } from "@/components/page-factory";

const { Page, generateStaticParams, generateMetadata } = createDocsPages({
    source: sdkSource,
    SidebarComponent: Sidebar,
    githubPrefix: "content/sdk"
});

export default Page;
export { generateStaticParams, generateMetadata };