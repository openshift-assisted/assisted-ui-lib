import { Cluster } from '../../../common';

/* The type is reverse engineered.
   The OCM object contains additional data.
 */
export type OcmClusterType = {
  id: string;
  external_id: string; // UUID
  cluster_id: string;

  name: string;
  display_name: string;
  openshift_version: string;

  managed: boolean;
  canEdit: boolean;
  canDelete: boolean;
  shouldRedirect: boolean;

  state: string; // i.e: ready

  product?: {
    id: string; // OCP-AssistedInstall
  };

  // Missing for AI-clusters since Subcription is created by AI-service.
  // Keeping here for backwards compatibility with old clusters
  cloud_provider?: {
    kind: string;
    id: string; // baremetal
  };

  console?: {
    url: string;
  };
  api?: {
    url: string;
  };

  aiCluster?: Cluster;
};
