import React from 'react';
import { Host } from '../../api';
import RoleDropdown from './RoleDropdown';

export type RoleCellProps = {
  host: Host;
  role: string;
  readonly?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditRole?: (role?: string) => Promise<any>;
};

const RoleCell: React.FC<RoleCellProps> = ({ host, role, readonly = false, onEditRole }) =>
  !readonly && onEditRole ? <RoleDropdown host={host} onEditRole={onEditRole} /> : <>{role}</>;

export default RoleCell;
