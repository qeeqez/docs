import "./custom.css";
import type {Metadata} from "next";
import {ApiWrapper} from "@/components/api-wrapper";
import {getBaseUrl} from "@/lib/base-url";

export default async function Page() {
  return <ApiWrapper/>;
}

export async function generateMetadata(): Promise<Metadata> {
  const appName = "Rixl";

  return {
    metadataBase: getBaseUrl(),
    title: `API Reference - ${appName}`,
    description: "Complete reference documentation for the Rixl API, including examples and code snippets for our endpoints in Python, cURL, and Node.js.",
    applicationName: appName,
  };
}
