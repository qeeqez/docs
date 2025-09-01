import {type HTMLAttributes} from 'react';
import {cn} from '../../../lib/cn';
import {
  type BaseLayoutProps,
  type NavOptions,
} from '../shared/index';
import {NavProvider} from 'fumadocs-ui/contexts/layout';
import {Header} from "@/components/layout/home/header";

export interface HomeLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
    /**
     * Open mobile menu when hovering the trigger
     */
    enableHoverToOpen?: boolean;
  }
  >;
}

export function HomeLayout(
  props: HomeLayoutProps & HTMLAttributes<HTMLElement>,
) {
  const {
    nav = {},
    links,
    githubUrl,
    i18n,
    disableThemeSwitch = false,
    themeSwitch = {enabled: !disableThemeSwitch},
    searchToggle,
    ...rest
  } = props;

  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <main
        id="nd-home-layout"
        {...rest}
        className={cn('flex flex-1 flex-col pt-14', rest.className)}
      >
        {nav.enabled !== false &&
          (nav.component ?? (
            <Header
              links={links}
              nav={nav}
              themeSwitch={themeSwitch}
              searchToggle={searchToggle}
              i18n={i18n}
              githubUrl={githubUrl}
            />
          ))}
        {props.children}
      </main>
    </NavProvider>
  );
}
