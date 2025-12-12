import {createMiddleware, createStart} from "@tanstack/react-start";
import {rewritePath} from "fumadocs-core/negotiation";

const {rewrite: rewriteLLM} = rewritePath("/:lang/{*path}.md", "/:lang/llms/{*path}");

// @ts-ignore
const llmMiddleware = createMiddleware().server(({next, request}) => {
  const url = new URL(request.url);
  if (!url.pathname.endsWith(".md")) return next();
  const path = rewriteLLM(url.pathname);

  // if (path) throw redirect(new URL(path, url));
  if (path) {
    const newUrl = new URL(path, url);
    const proxyRequest = new Request(newUrl, request);
    return fetch(proxyRequest);
  }
  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [llmMiddleware],
  };
});
