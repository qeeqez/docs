import {createFileRoute, redirect} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    throw redirect({
      to: "/en/home/getting-started/overview", // TODO lang dependent url
    });
  },
});
