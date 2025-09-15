import {DocsLayout} from "@/components/layout/sdk";
import {baseOptions} from '@/lib/layout.shared';
import {sdkSource} from '@/lib/source';

export default function Layout({children}: LayoutProps<'/sdk'>) {
  return (
    <DocsLayout tree={sdkSource.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
