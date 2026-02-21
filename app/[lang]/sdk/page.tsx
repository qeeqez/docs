import {redirect} from "next/navigation";
import {source} from "@/lib/source";

export const metadata = {
  title: "SDK Reference | Rixl",
  description: "Rixl SDK reference documentation and getting started guides.",
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
  redirect(`/${params.lang}/sdk/getting-started`);
}
