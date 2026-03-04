import {createFileRoute, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/home/")({
  beforeLoad: ({params}) => {
    throw redirect({
      to: "/$lang/$",
      params: {
        lang: params.lang,
        _splat: "home/getting-started/overview",
      },
    });
  },
});
