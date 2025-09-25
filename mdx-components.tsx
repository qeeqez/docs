import defaultMdxComponents from "fumadocs-ui/mdx";
import type {MDXComponents} from "mdx/types";
import {VideoMDX} from "./components/rixl/video-mdx";
import {InteractiveCard, InfoCard, Callout} from "./components/mdx-ui";
import {Banner} from "fumadocs-ui/components/banner";
import {Card, Cards} from "fumadocs-ui/components/card";
import {Tab, Tabs} from "fumadocs-ui/components/tabs";
import {Step, Steps} from "fumadocs-ui/components/steps";
import {Callout as FumadocsCallout} from "fumadocs-ui/components/callout";
import Link from "fumadocs-core/link";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const mdxComponents = { ...defaultMdxComponents };

  const customComponents = {
    InteractiveCard,
    InfoCard,
    Callout,
    VideoMDX,
    Banner,
    Card,
    Cards,
    Tab,
    Tabs,
    Step,
    Steps,
    Link,
    FumadocsCallout
  };

  return {
    ...mdxComponents,
    ...customComponents,
    ...components,
  };
}
