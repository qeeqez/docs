import {DocsLayout} from "@/components/layout/docs";
import {baseOptions} from '@/lib/layout.shared';
import {sdkSource} from '@/lib/source';

export default function Layout({children}: LayoutProps<'/docs/sdk'>) {
  return (
    <DocsLayout tree={sdkSource.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
