import { OcmClusterType } from './types';

export const getOpenshiftClusterId = (ocmCluster?: OcmClusterType) =>
  ocmCluster && ocmCluster.external_id;

export const canAddHost = ({ cluster }: { cluster: OcmClusterType }) => {
  let isAllowed = false;

  if (getOpenshiftClusterId(cluster)) {
    // Collision of "ready" states for AI and Telemetry
    // Show the tab only if telemetry reports "ready", not the AI
    if (
      (cluster.state === 'ready' &&
        cluster.product?.id === 'OCP-AssistedInstall' &&
        (!cluster.aiCluster || cluster.aiCluster.status === 'installed')) ||
      // Backward compatibility for old AI clusters (when the subscription was created by
      // the telemetry instead of by the AI-Service)
      (cluster.product?.id !== 'OCP-AssistedInstall' && cluster.cloud_provider?.id === 'baremetal')
    ) {
      isAllowed = true;
    }

    if (cluster.aiCluster && cluster.aiCluster['high_availability_mode'] === 'None') {
      isAllowed = false;
    }
  }

  return isAllowed;
};
