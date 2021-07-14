import React from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import {
  Cluster,
  ClusterCreateParams,
  ClusterUpdateParams,
  ManagedDomain,
  useAlerts,
  LoadingState,
  ClusterWizardStep,
} from '../../../common';
import { usePullSecretFetch } from '../fetching/pullSecret';
import { getClusters, patchCluster, postCluster } from '../../api/clusters';
import { getErrorMessage, handleApiError } from '../../api/utils';
import { updateCluster } from '../../reducers/clusters/currentClusterSlice';
import { useDispatch } from 'react-redux';
import ClusterWizardContext from './ClusterWizardContext';
import { getManagedDomains } from '../../api/domains';
import { canNextClusterDetails, ClusterWizardFlowStateType } from './wizardTransition';
import { useOpenshiftVersions } from '../fetching/openshiftVersions';
import ClusterDetailsForm from './ClusterDetailsForm';
import ClusterWizardNavigation from './ClusterWizardNavigation';
import { routeBasePath } from '../../config/routeBaseBath';

type ClusterDetailsProps = {
  cluster?: Cluster;
};

const ClusterDetails: React.FC<ClusterDetailsProps> = ({ cluster }) => {
  const { setCurrentStepId } = React.useContext(ClusterWizardContext);
  const [managedDomains, setManagedDomains] = React.useState<ManagedDomain[]>();
  const [usedClusterNames, setUsedClusterNames] = React.useState<string[]>();
  const { addAlert, clearAlerts } = useAlerts();
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchManagedDomains = async () => {
      try {
        const { data } = await getManagedDomains();
        setManagedDomains(data);
      } catch (e) {
        setManagedDomains([]);
        handleApiError(e, () =>
          addAlert({ title: 'Failed to retrieve managed domains', message: getErrorMessage(e) }),
        );
      }
    };
    fetchManagedDomains();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(
    () => {
      const fetcher = async () => {
        try {
          const { data: clusters } = await getClusters();
          const names = clusters
            .filter((c) => !cluster || c.id !== cluster.id)
            .map((c) => `${c.name}.${c.baseDnsDomain}`);
          setUsedClusterNames(names);
        } catch (e) {
          setUsedClusterNames([]);
          handleApiError(e, () =>
            addAlert({
              title: 'Failed to retrieve names of existing clusters.',
              message: getErrorMessage(e),
            }),
          );
        }
      };
      fetcher();
    },
    // just once
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const pullSecret = usePullSecretFetch();

  const { error: errorOCPVersions, loading: loadingOCPVersions, versions } = useOpenshiftVersions();

  React.useEffect(() => errorOCPVersions && addAlert(errorOCPVersions), [
    errorOCPVersions,
    addAlert,
  ]);

  const moveNext = () => setCurrentStepId('host-discovery');

  const handleClusterUpdate = async (clusterId: Cluster['id'], values: ClusterUpdateParams) => {
    clearAlerts();
    const params: ClusterUpdateParams = _.omit(values, [
      'highAvailabilityMode',
      'pullSecret',
      'openshiftVersion',
    ]);

    try {
      const { data } = await patchCluster(clusterId, params);
      dispatch(updateCluster(data));

      canNextClusterDetails({ cluster: data }) && moveNext();
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        addAlert({ title: 'Failed to update the cluster', message: getErrorMessage(e) }),
      );
    }
  };

  const handleClusterCreate = async (params: ClusterCreateParams) => {
    clearAlerts();

    try {
      const { data } = await postCluster(params);
      const locationState: ClusterWizardFlowStateType = { wizardFlow: 'new' };
      // TODO(mlibra): figure out subscription ID and navigate to ${routeBasePath}/../details/s/${subscriptionId} instead
      history.push(`${routeBasePath}/clusters/${data.id}`, locationState);
    } catch (e) {
      handleApiError<ClusterCreateParams>(e, () =>
        addAlert({ title: 'Failed to create new cluster', message: getErrorMessage(e) }),
      );
    }
  };

  if (pullSecret === undefined || !managedDomains || loadingOCPVersions || !usedClusterNames) {
    return (
      <ClusterWizardStep navigation={<ClusterWizardNavigation cluster={cluster} />}>
        <LoadingState />
      </ClusterWizardStep>
    );
  }
  const navigation = <ClusterWizardNavigation cluster={cluster} />;

  return (
    <ClusterDetailsForm
      cluster={cluster}
      pullSecret={pullSecret}
      managedDomains={managedDomains}
      ocpVersions={versions}
      usedClusterNames={usedClusterNames}
      moveNext={moveNext}
      handleClusterUpdate={handleClusterUpdate}
      handleClusterCreate={handleClusterCreate}
      navigation={navigation}
    />
  );
};

export default ClusterDetails;
