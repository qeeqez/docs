"use client";

import {useI18n} from "fumadocs-ui/contexts/i18n";
import {type ComponentProps, useEffect, useState} from "react";
import {cn} from "@/lib/cn";

export function PageLastUpdate({date: value, ...props}: Omit<ComponentProps<"p">, "children"> & {
  date: Date | string
}) {
  const {text} = useI18n();
  const [date, setDate] = useState("");

  useEffect(() => {
    // to the timezone of client
    setDate(new Date(value).toLocaleDateString());
  }, [value]);

  return (
    <p {...props} className={cn("text-sm text-fd-muted-foreground", props.className)}>
      {text.lastUpdate} {date}
    </p>
  );
}