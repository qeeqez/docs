import {redirect} from "next/navigation";
import {source} from "@/lib/source";

export const metadata = {
  title: "Rixl Documentation",
  description: "Rixl documentation and developer guides.",
};

interface RedirectProps {
  params: Promise<{lang: string}>;
}

export async function generateStaticParams() {
  const params = source.generateParams("lang");

  return params.map((param) => ({
    lang: param.lang,
  }));
}

export default async function Redirect(props: RedirectProps) {
  const params = await props.params;
  redirect(`/${params.lang}/home/getting-started/overview`);
}
