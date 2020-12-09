import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { normalizeClusterVersion } from '../../config';
import { OcmClusterType } from './types';
import { AddHostsClusterCreateParams, Cluster, getCluster, handleApiError } from '../../api';
import { getOpenshiftClusterId } from './utils';
import { usePullSecretFetch } from '../fetching/pullSecret';
import { ErrorState, LoadingState } from '../ui';
import { addHostsClusters } from '../../api/addHostsClusters';
import { AlertsContextProvider } from '../AlertsContextProvider';
import { POLLING_INTERVAL } from '../../config';
import AddBareMetalHosts from './AddBareMetalHosts';
import { AddBareMetalHostsContextProvider } from './AddBareMetalHostsContext';

export const BareMetalHostsClusterDetailTab: React.FC<{
  cluster?: OcmClusterType;
  isVisible: boolean;
}> = ({ cluster, isVisible }) => {
  const [error, setError] = React.useState<string>();
  const [day2Cluster, setDay2Cluster] = React.useState<Cluster | null>();
  const pullSecret = usePullSecretFetch();

  React.useEffect(() => {
    if (!isVisible && day2Cluster) {
      // the tab is not visible, stop polling
      setDay2Cluster(undefined);
    }

    const openshiftClusterId = getOpenshiftClusterId(cluster);

    if (isVisible && day2Cluster === undefined && cluster && openshiftClusterId && pullSecret) {
      // ensure exclusive run
      setDay2Cluster(null);

      // validate input
      const openshiftVersion = normalizeClusterVersion(cluster.openshift_version);
      if (!openshiftVersion) {
        setError(`Unsupported OpenShift cluster version: ${cluster.openshift_version}`);
        return;
      }

      let apiVipDnsname = '';
      // Format of cluster.api.url: protocol://domain:port
      if (cluster.api?.url) {
        try {
          const apiVipUrl = new URL(cluster.api.url);
          apiVipDnsname = apiVipUrl.hostname; // just domain is needed
        } catch {
          setError('Cluster API URL is not valid.');
          return;
        }
      } else if (cluster.console?.url) {
        // Try to guess API URL from Console URL.
        // Assumption: the cluster is originated by Assisted Installer, so console URL format should be of a fixed format.
        try {
          // protocol://console-openshift-console.apps.[CLUSTER_NAME].[BASE_DOMAIN]"
          const consoleUrlHostname = new URL(cluster.console.url).hostname;
          const APPS = '.apps.';
          apiVipDnsname =
            'api.' + consoleUrlHostname.substring(consoleUrlHostname.indexOf(APPS) + APPS.length);
        } catch {
          setError('Cluster Console URL is not valid.');
          return;
        }
      }

      if (!apiVipDnsname) {
        setError('Missing API URL');
        return;
      }

      const doItAsync = async () => {
        let dayTwoClusterExists = false;
        // try to find Day 2 cluster (can be missing)
        try {
          // The Day-2's cluster.id is always equal to the openshift_cluster_id, there is recently
          // no way how to pass openshif_cluster_id other way than set it to the cluster.id (not even via API).
          // There can not be >1 of Day 2 clusters. The Cluster.openshift_cluster_id is irrelevant to the Day 2 clusters.
          const { data } = await getCluster(openshiftClusterId);
          setDay2Cluster(data);
          dayTwoClusterExists = true;
        } catch (e) {
          if (e.response?.status !== 404) {
            handleApiError(e);
            setError('Failed to read cluster details.');
            return;
          }
        }

        if (!dayTwoClusterExists) {
          try {
            // Optionally create Day 2 cluster
            const { data } = await addHostsClusters({
              id: openshiftClusterId, // used to both match OpenShift Cluster and as an assisted-installer ID
              name: `scale-up-${cluster.display_name || cluster.name || openshiftClusterId}`, // both cluster.name and cluster.display-name contain just UUID which fails AI validation (k8s naming conventions)
              openshiftVersion,
              apiVipDnsname,
            });
            // all set, we can refirect
            setDay2Cluster(data);
          } catch (e) {
            handleApiError<AddHostsClusterCreateParams>(e);
            setError('Failed to create wrapping cluster for adding new hosts.');
          }
        }
      };

      doItAsync();
    }
  }, [cluster, pullSecret, day2Cluster, isVisible]);

  React.useEffect(() => {
    if (day2Cluster) {
      const id = setTimeout(() => {
        const doItAsync = async () => {
          try {
            const { data } = await getCluster(day2Cluster.id);
            setDay2Cluster(data);
          } catch (e) {
            handleApiError<AddHostsClusterCreateParams>(e);
            setError('Failed to reload cluster data.');
          }
        };
        doItAsync();
      }, POLLING_INTERVAL);
      return () => clearTimeout(id);
    }
  }, [day2Cluster]);

  if (error) {
    return (
      <ErrorState
        content={
          <>
            {error}
            <br />
            Check your connection and{' '}
            <Button
              onClick={() => {
                setError(undefined);
                setDay2Cluster(undefined);
              }}
              variant={ButtonVariant.link}
              isInline
            >
              try again
            </Button>
            .
          </>
        }
        title="Failed to prepare the cluster for adding hosts."
      />
    );
  }

  if (!day2Cluster) {
    return <LoadingState content="Preparing cluster for adding hosts..." />;
  }

  return (
    <AlertsContextProvider>
      <AddBareMetalHostsContextProvider cluster={day2Cluster} ocpConsoleUrl={cluster?.console?.url}>
        <AddBareMetalHosts />
      </AddBareMetalHostsContextProvider>
    </AlertsContextProvider>
  );
};
