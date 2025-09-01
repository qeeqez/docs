import {NavProvider} from 'fumadocs-ui/contexts/layout';
import type {HTMLAttributes} from 'react';
import {Footer} from "@/components/layout/home/footer";
import {Header} from "@/components/layout/home/header";
import {cn} from '../../../lib/cn';
import type {
  BaseLayoutProps,
  NavOptions,
} from '../shared/index';

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
        <Header
          links={links}
          nav={nav}
          searchToggle={searchToggle}
          i18n={i18n}
          githubUrl={githubUrl}
        />
        {props.children}
        <Footer/>
      </main>
    </NavProvider>
  );
}
