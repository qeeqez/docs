import {createFileRoute, Navigate} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/sdk")({
  component: SDKRedirect,
});

function SDKRedirect() {
  const {lang} = Route.useParams();
  return <Navigate to={`/${lang}/sdk/getting-started`} />;
}
