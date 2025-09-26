import Link from "fumadocs-core/link";
import {Banner} from "fumadocs-ui/components/banner";
import {Callout as FumadocsCallout} from "fumadocs-ui/components/callout";
import {Card, Cards} from "fumadocs-ui/components/card";
import {Step, Steps} from "fumadocs-ui/components/steps";
import {Tab, Tabs} from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type {MDXComponents} from "mdx/types";
import {Callout, InfoCard, InteractiveCard } from "@/components";
import {VideoMDX} from "@/components/mdx/video-mdx";

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
