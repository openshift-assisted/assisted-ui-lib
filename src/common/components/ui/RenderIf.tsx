import React, { PropsWithChildren } from 'react';

interface RenderIfProps {
  condition: boolean;
}

export const RenderIf = ({ condition = false, children }: PropsWithChildren<RenderIfProps>) =>
  condition ? <>{children}</> : null;

export const RenderIfElse = (props: {
  condition: boolean;
  truthy: React.ReactNode;
  falsy: React.ReactNode;
}) => (props.condition ? <>{props.truthy}</> : <>{props.falsy}</>);
