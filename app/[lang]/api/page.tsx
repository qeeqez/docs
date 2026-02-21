import {redirect} from "next/navigation";
import {source} from "@/lib/source";

export const metadata = {
  title: "API Reference | Rixl",
  description: "Rixl API reference documentation.",
};

interface RedirectProps {
  params: {lang: string};
}

export async function generateStaticParams() {
  const params = source.generateParams("lang");

  return params.map((param) => ({
    lang: param.lang,
  }));
}

export default async function Redirect(props: RedirectProps) {
  const params = await props.params;
  redirect(`/${params.lang}/api/images/images/get`);
}
