import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { Host, Inventory } from '../../api';
import { getHostname } from './utils';
import { DASH } from '../constants';

type HostnameProps = {
  host: Host;
  onEditHostname?: () => void;
  className?: string;
  // Provide either inventory or title
  inventory?: Inventory;
  title?: string;
};

const Hostname: React.FC<HostnameProps> = ({
  host,
  inventory = {},
  onEditHostname,
  title,
  className,
}) => {
  const hostname = title || getHostname(host, inventory) || DASH;
  const isHostnameChangeRequested = !title && host.requestedHostname !== inventory.hostname;

  const body = (
    <>
      {hostname}
      {isHostnameChangeRequested && ' *'}
    </>
  );

  return onEditHostname ? (
    <>
      <Button variant={ButtonVariant.link} isInline onClick={onEditHostname} className={className}>
        {body}
      </Button>
    </>
  ) : (
    body
  );
};
export default Hostname;
