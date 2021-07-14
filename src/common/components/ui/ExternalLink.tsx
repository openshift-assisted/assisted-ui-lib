import React, { ReactNode } from 'react';
import { Text } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

interface ExternalLinkProps {
  href: string;
  children?: ReactNode;
}
const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, ...rest }) => (
  <Text component="a" href={href} target="_blank" rel="noopener noreferrer" {...rest}>
    {children ? children : href} <ExternalLinkAltIcon color="rgb(0, 123, 186)" />
  </Text>
);
export default ExternalLink;
