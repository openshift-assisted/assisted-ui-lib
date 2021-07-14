import { Cluster, HostsTableProps, OpenshiftVersionOptionType } from '../../../common';
import { ClusterDetailsValues } from '../../../common/components/clusterWizard/types';
import { NetworkConfigurationValues } from '../../../common/types/clusters';

export type ClusterDeploymentHostsTablePropsActions = Pick<
  HostsTableProps,
  'onEditHost' | 'canEditHost' | 'onEditRole' | 'canEditRole' | 'onDeleteHost' | 'canDelete'

  /* TODO(mlibra): List other actions
      onHostEnable: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      onInstallHost: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      onHostDisable: async (event: React.MouseEvent, rowIndex: number, rowData: IRowData) => {
      onViewHostEvents 
      onHostReset
      onDownloadHostLogs

      canEditRole: (host: Host) => canEditRoleUtil(cluster, host.status),
      canInstallHost: (host: Host) => canInstallHostUtil(cluster, host.status),
      canEditDisks: (host: Host) => canEditDisksUtil(cluster.status, host.status),
      canEnable: (host: Host) => canEnableUtil(cluster.status, host.status),
      canDisable: (host: Host) => canDisableUtil(cluster.status, host.status),
      canEditHost: (host: Host) => canEditHostUtil(cluster.status, host.status),
      canReset: (host: Host) => canResetUtil(cluster.status, host.status),
  */
>;

export type ClusterDeploymentWizardStepsType = 'cluster-details' | 'networking';

export type ClusterDeploymentDetailsProps = {
  defaultPullSecret: string;
  ocpVersions: OpenshiftVersionOptionType[];
  cluster?: Cluster;
  usedClusterNames: string[];
};

export type ClusterDeploymentDetailsValues = ClusterDetailsValues;

export type ClusterDeploymentNetworkingValues = NetworkConfigurationValues;

export type ClusterDeploymentDetailsStepProps = ClusterDeploymentDetailsProps & {
  onSaveDetails: (values: ClusterDeploymentDetailsValues) => Promise<string | void>;
  onClose: () => void;
};

export type ClusterDeploymentDetailsNetworkingProps = {
  cluster: Cluster;

  onSaveNetworking: (values: ClusterDeploymentNetworkingValues) => Promise<string | void>;
  onClose: () => void;
} & ClusterDeploymentHostsTablePropsActions;

export type ClusterDeploymentWizardProps = ClusterDeploymentDetailsProps & {
  className?: string;

  onClose: () => void;
  onSaveDetails: ClusterDeploymentDetailsStepProps['onSaveDetails'];
  onSaveNetworking: ClusterDeploymentDetailsNetworkingProps['onSaveNetworking'];
} & ClusterDeploymentHostsTablePropsActions;
