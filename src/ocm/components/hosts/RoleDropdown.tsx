import React from 'react';
import { Host, HOST_ROLES } from '../../../common';
import { SimpleDropdown } from '../ui/SimpleDropdown';
import { getHostRole } from './utils';

type RoleDropdownProps = {
  host: Host;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditRole: (role?: string) => Promise<any>;
};

export const RoleDropdown: React.FC<RoleDropdownProps> = ({ host, onEditRole }) => {
  const [isDisabled, setDisabled] = React.useState(false);

  const setRole = async (role?: string) => {
    setDisabled(true);
    try {
      await onEditRole(role);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <SimpleDropdown
      defaultValue={HOST_ROLES[0].value}
      current={getHostRole(host)}
      items={HOST_ROLES}
      setValue={setRole}
      isDisabled={isDisabled}
      idPrefix={`role-${host.requestedHostname}`}
    />
  );
};
