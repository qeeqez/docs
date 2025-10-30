import "./custom.css";
import type {Metadata} from "next";
import {ApiWrapper} from "@/components/api-wrapper";
import {getBaseUrl} from "@/lib/base-url";
import {source} from "@/lib/source";

export default async function Page() {
  return <ApiWrapper/>;
}

export async function generateStaticParams() {
  const params = source.generateParams('lang');

  return params.map(param => ({
    lang: param.lang,
  }));
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
