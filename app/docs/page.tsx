import {redirect} from "next/navigation";
import {firstPageURL} from "@/lib/layout.shared";

export default function Redirect() {
  redirect(firstPageURL);
}
