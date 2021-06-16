import { TableAction } from './HostsTable';

type TableActionFactory = (
  onClick: TableAction['onClick'],
  isVisible?: TableAction['isVisible'],
) => TableAction;

export const installHost: TableActionFactory = (onClick, isVisible) => ({
  title: 'Install host',
  id: 'button-install-host',
  onClick,
  isVisible,
});

export const editHost: TableActionFactory = (onClick, isVisible) => ({
  title: 'Edit host',
  id: 'button-edit-host', // id is everchanging, not ideal for tests
  onClick,
  isVisible,
});

export const enableHost: TableActionFactory = (onClick, isVisible) => ({
  title: 'Enable in cluster',
  id: 'button-enable-in-cluster',
  onClick,
  isVisible,
});

export const disableHost: TableActionFactory = (onClick, isVisible) => ({
  title: 'Disable in cluster',
  id: 'button-disable-in-cluster',
  onClick,
  isVisible,
});

export const resetHost: TableActionFactory = (onClick, isVisible) => ({
  title: 'Reset host',
  id: 'button-reset-host',
  onClick,
  isVisible,
});

export const viewHostEvents: TableActionFactory = (onClick) => ({
  title: 'View host events',
  id: 'button-view-host-events',
  onClick,
});

export const downloadHostLogs: TableActionFactory = (onClick, isVisible) => ({
  title: 'Download host logs',
  id: 'button-download-host-installation-logs',
  onClick,
  isVisible,
});

export const deleteHost: TableActionFactory = (onClick, isVisible) => ({
  title: 'Delete host',
  id: 'button-delete-host',
  onClick,
  isVisible,
});
