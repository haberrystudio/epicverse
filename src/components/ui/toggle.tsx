"use client";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import type { ComponentProps } from "react";
export function Toggle({
  className = "",
  ...props
}: ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={"toggle " + className}
      {...props}
    />
  );
}
