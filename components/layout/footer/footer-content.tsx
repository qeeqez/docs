import {useMemo} from "react";
import {cn} from "@/lib/cn";
import {FooterSections} from "@/lib/layout.shared";
import {FooterContentSection} from "./footer-content-section";

export function FooterContent() {
  const sections = useMemo(() => FooterSections(), []);
  return (
    <div
      className={cn("max-w-screen-xl w-full px-10 mx-auto", "grid grid-cols-2 lg:grid-cols-5", "gap-6 md:gap-8", "lg:justify-items-center")}
    >
      {sections.map((section, index) => (
        <FooterContentSection key={`${index}-${section.title}`} title={section.title} links={section.links} />
      ))}
    </div>
  );
}
