import {createFileRoute, Navigate} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/")({
  component: LangRedirect,
});

function LangRedirect() {
  const {lang} = Route.useParams();
  return <Navigate to={`/${lang}/home/getting-started/overview`} />;
}
