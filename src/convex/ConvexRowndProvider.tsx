import React from "react";
import { RowndProvider as ReactRowndProvider, useRownd } from "../context";
import { ConvexProviderWithRownd } from "./ConvexProviderWithRownd";
import { ConvexRowndProviderProps } from "./types";

export const ConvexRowndProvider = ({
  children,
  client,
  ...props
}: ConvexRowndProviderProps) => {
  return (
    <ReactRowndProvider {...props}>
      <ConvexProviderWithRownd client={client} useRownd={useRownd}>
        {children}
      </ConvexProviderWithRownd>
    </ReactRowndProvider>
  ) as any;
};
