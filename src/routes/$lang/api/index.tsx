import {createFileRoute, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/api/")({
  beforeLoad: ({params}) => {
    throw redirect({
      to: "/$lang/$",
      params: {
        lang: params.lang,
        _splat: "api/feeds/get-feeds-feedid",
      },
    });
  },
});
