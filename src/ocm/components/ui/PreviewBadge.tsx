import React from 'react';
import { Label, LabelProps } from '@patternfly/react-core';

export enum PreviewBadgePosition {
  default,
  inline,
  inlineRight,
}

type DeveloperPreviewProps = {
  position?: PreviewBadgePosition;
  className?: string;
};
type TechnologyPreviewProps = DeveloperPreviewProps;

const PreviewBadge: React.FC<
  DeveloperPreviewProps & { text: string; color?: LabelProps['color'] }
> = ({ position = PreviewBadgePosition.inlineRight, className = '', color = 'orange', text }) => {
  let clsName = className;
  switch (position) {
    case PreviewBadgePosition.inlineRight:
      clsName += ' assisted-ui-float-right';
      break;
    case PreviewBadgePosition.inline:
      clsName += ' assisted-ui-display-inline';
      break;
  }

  return (
    <Label className={clsName} color={color}>
      {text}
    </Label>
  );
};

export const DeveloperPreview: React.FC<DeveloperPreviewProps> = (props) => (
  <PreviewBadge {...props} text="Developer Preview" />
);
export const TechnologyPreview: React.FC<TechnologyPreviewProps> = (props) => (
  <PreviewBadge {...props} text="Technology Preview" />
);
