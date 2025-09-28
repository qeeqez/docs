import Link from "fumadocs-core/link";
import {Banner} from "fumadocs-ui/components/banner";
import {Step, Steps} from "fumadocs-ui/components/steps";
import {Tab, Tabs} from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type {MDXComponents} from "mdx/types";
import {Callout, Card, Columns, Video} from "@/components";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const {
    Card: _,
    Cards: __,
    Callout: ___,
    ...mdxComponents
  } = defaultMdxComponents;

  const rixlComponents = {
    Card,
    Callout,
    Columns,
    Video,
  };

  const customComponents = {
    Banner,
    Tab,
    Tabs,
    Step,
    Steps,
    Link,
  };

  return {
    ...mdxComponents,
    ...customComponents,
    ...rixlComponents,
    ...components,
  };
}
