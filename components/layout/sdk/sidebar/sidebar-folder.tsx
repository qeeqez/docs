import {useOnChange} from "fumadocs-core/utils/use-on-change";
import {Collapsible, } from "fumadocs-ui/components/ui/collapsible";
import {type ComponentProps, createContext, useContext, useMemo, useState} from "react";

const FolderContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function useFolderContext() {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error('Missing sidebar folder');

  return ctx;
}

export function SidebarFolder({
                                defaultOpen = false,
                                ...props
                              }: ComponentProps<'div'> & {
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useOnChange(defaultOpen, (v) => {
    if (v) setOpen(v);
  });

  return (
    <Collapsible open={open} onOpenChange={setOpen} {...props}>
      <FolderContext.Provider
        value={useMemo(() => ({open, setOpen}), [open])}
      >
        {props.children}
      </FolderContext.Provider>
    </Collapsible>
  );
}

