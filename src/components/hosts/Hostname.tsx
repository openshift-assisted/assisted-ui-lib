import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { Host } from '../../api/types';
import { getHostname, getInventory } from './utils';
import { DASH } from '../constants';

type HostnameProps = {
  host: Host;
  onEditHostname?: () => void;
  className?: string;
  title?: string;
};

const Hostname: React.FC<HostnameProps> = ({ host, onEditHostname, title, className }) => {
  const hostname = title || getHostname(host) || DASH;

  const isHostnameChangeRequested =
    !title && host.requestedHostname !== getInventory(host).hostname;

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
