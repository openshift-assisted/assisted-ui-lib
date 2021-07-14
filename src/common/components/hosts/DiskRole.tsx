import React from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import { Disk, DiskRole as DiskRoleValue, Host } from '../../api';
import { DISK_ROLE_LABELS } from '../../config';

const getCurrentDiskRoleLabel = (disk: Disk, installationDiskId: Host['installationDiskId']) =>
  disk.id === installationDiskId ? DISK_ROLE_LABELS.install : DISK_ROLE_LABELS.none;

export type onDiskRoleType = (
  hostId: Host['id'],
  diskId: Disk['id'],
  role: DiskRoleValue,
) => Promise<void>;

export type DiskRoleProps = {
  host: Host;
  disk: Disk;
  installationDiskId: Host['installationDiskId'];
  isEditable: boolean;
  onDiskRole?: onDiskRoleType;
};

const DiskRole: React.FC<DiskRoleProps> = ({
  host,
  disk,
  installationDiskId,
  isEditable,
  onDiskRole,
}) => {
  if (isEditable && disk.id !== installationDiskId && onDiskRole) {
    return (
      <DiskRoleDropdown
        host={host}
        disk={disk}
        installationDiskId={installationDiskId}
        onDiskRole={onDiskRole}
      />
    );
  }
  return <>{getCurrentDiskRoleLabel(disk, installationDiskId)}</>;
};

type DiskRoleDropdownProps = {
  host: Host;
  disk: Disk;
  installationDiskId: Host['installationDiskId'];
  onDiskRole: onDiskRoleType;
};

const DiskRoleDropdown: React.FC<DiskRoleDropdownProps> = ({
  host,
  disk,
  installationDiskId,
  onDiskRole,
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(false);

  const dropdownItems = [
    <DropdownItem
      key="install"
      id="install"
      isDisabled={!disk.installationEligibility?.eligible}
      description={
        !disk.installationEligibility?.eligible && 'Disk is not eligible for installation'
      }
    >
      {DISK_ROLE_LABELS.install}
    </DropdownItem>,
  ];

  const onSelect = React.useCallback(
    (event?: React.SyntheticEvent<HTMLDivElement>) => {
      const asyncFunc = async () => {
        if (event?.currentTarget.id) {
          setDisabled(true);
          await onDiskRole(host.id, disk.id, event.currentTarget.id as DiskRoleValue);
          setDisabled(false);
        }
        // TODO(mlibra): Improve for the case onDiskRole === undefined
        setOpen(false);
      };
      asyncFunc();
    },
    [setOpen, disk.id, host.id, onDiskRole],
  );

  const currentRoleLabel = getCurrentDiskRoleLabel(disk, installationDiskId);
  const toggle = React.useMemo(
    () => (
      <DropdownToggle
        onToggle={(val) => setOpen(val)}
        toggleIndicator={CaretDownIcon}
        isDisabled={isDisabled}
        className="pf-c-button pf-m-link pf-m-inline"
      >
        {currentRoleLabel}
      </DropdownToggle>
    ),
    [setOpen, currentRoleLabel, isDisabled],
  );

  return (
    <Dropdown
      onSelect={onSelect}
      dropdownItems={dropdownItems}
      toggle={toggle}
      isOpen={isOpen}
      isPlain
    />
  );
};

export default DiskRole;
