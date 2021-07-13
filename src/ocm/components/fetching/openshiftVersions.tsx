import React from 'react';
import { AddHostsClusterCreateParams } from '../../../common';
import { OpenshiftVersionOptionType } from '../../../common';
import { getErrorMessage, getOpenshiftVersions, handleApiError } from '../../api';

type useOpenshiftVersionsType = {
  versions: OpenshiftVersionOptionType[];
  normalizeClusterVersion: (version?: string) => AddHostsClusterCreateParams['openshiftVersion'];
  error?: { title: string; message: string };
  loading: boolean;
};

export const useOpenshiftVersions = (): useOpenshiftVersionsType => {
  const [versions, setVersions] = React.useState<OpenshiftVersionOptionType[]>();
  const [error, setError] = React.useState<useOpenshiftVersionsType['error']>();

  React.useEffect(() => {
    const doAsync = async () => {
      try {
        const { data } = await getOpenshiftVersions();
        const versions: OpenshiftVersionOptionType[] = Object.keys(data)
          .sort()
          .map((key) => ({
            label: `OpenShift ${data[key].displayName || key}`,
            value: key,
            default: !!data[key].default,
            supportLevel: data[key].supportLevel,
          }));

        setVersions(versions);
      } catch (e) {
        return handleApiError(e, (e) => {
          setError({
            title: 'Failed to retrieve list of supported OpenShift versions.',
            message: getErrorMessage(e),
          });
        });
      }
    };
    doAsync();
  }, [setVersions]);

  const normalizeClusterVersion = React.useCallback(
    (version = ''): string =>
      versions?.map((obj) => obj.value).find((normalized) => version.startsWith(normalized)) ||
      version,
    [versions],
  );

  return {
    error,
    loading: !error && !versions,
    versions: versions || [],
    normalizeClusterVersion,
  };
};
