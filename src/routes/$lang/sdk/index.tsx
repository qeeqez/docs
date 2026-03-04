import {createFileRoute, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/sdk/")({
  beforeLoad: ({params}) => {
    throw redirect({
      to: "/$lang/$",
      params: {
        lang: params.lang,
        _splat: "sdk/getting-started/overview",
      },
    });
  },
});
