import {cloneElement, type ComponentProps, type ReactElement} from "react";
import dynamicIconImports from "lucide-react/dynamic";
import {HousePlugIcon, LucideProps} from "lucide-react";
import {cn} from "@/lib/cn";

export type IconName = keyof typeof dynamicIconImports;

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
  if (icon) return cloneElement(icon, props);

  // TODO fix dynamic icon loading
  return HousePlugIcon;

  // const iconName = name?.toLowerCase() as IconName;
  // const iconLoader = dynamicIconImports[iconName];
  //
  // if (!iconLoader) return <SVGIcon {...props} />;
  // const LucideIcon = lazy(iconLoader);
  // return (
  //   <Suspense fallback={<SVGIcon {...props} />}>
  //     <LucideIcon {...props} />
  //   </Suspense>
  // );
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
