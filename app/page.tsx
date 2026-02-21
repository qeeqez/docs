import {redirect} from "next/navigation";

export const metadata = {
  title: "Rixl Documentation",
  description: "Rixl documentation and developer guides.",
};

export default function Redirect() {
  redirect("/en/home/getting-started/overview");
}
