import type {LucideProps} from "lucide-react";
import type {IconName} from "lucide-react/dynamic";
import dynamic from "next/dynamic";
import React, {type ComponentProps, type ReactElement} from "react";
import {cn} from "@/lib/cn";

type IconProps = Omit<LucideProps, "name"> &
  (
    | {
        name: IconName;
        icon?: never;
      }
    | {
        name?: never;
        icon: ReactElement;
      }
  );

export const Icon = ({name, icon, ...props}: IconProps) => {
  if (icon) {
    return React.cloneElement(icon, props);
  }

  const LucideIcon = dynamic(() => import(`lucide-react/dist/esm/icons/${name.toLowerCase()}`).catch(() => () => <SVGIcon {...props} />), {
    ssr: true,
  });

  return <LucideIcon {...props} />;
};

const SVGIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={cn("lucide", props.className)}
      {...props}
    />
  );
};
