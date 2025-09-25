"use client";

import type {icons, LucideProps} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, {type ComponentProps, type ReactElement} from 'react';
import {cn} from "@/lib/cn";

export type IconName = keyof typeof icons;

type IconProps = Omit<LucideProps, 'name'> &
  ({
    name: IconName;
    icon?: never;
  } |
    {
      name?: never;
      icon: ReactElement;
    });

export const Icon = ({name, icon, ...props}: IconProps) => {
  if (icon) {
    return React.cloneElement(icon, props);
  }

  const LucideIcon = dynamic(() =>
    import(`lucide-react/dist/esm/icons/${name.toLowerCase()}`)
      .catch(() => SVGIcon),
    {ssr: false,}
  );

  return <LucideIcon {...props} />;
};

const SVGIcon = (props: ComponentProps<'svg'>) => {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={cn("lucide", props.className)}
    {...props}
  />;
}