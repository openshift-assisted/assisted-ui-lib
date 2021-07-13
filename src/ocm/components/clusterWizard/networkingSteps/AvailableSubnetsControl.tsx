import React from 'react';
import { Alert, AlertActionLink, AlertVariant, Popover } from '@patternfly/react-core';
import { NO_SUBNET_SET, SelectField, Cluster, Host } from '../../../../common';
import { HostSubnet, HostSubnets } from '../../../../common/types/clusters';

interface SubnetHelperTextProps {
  matchingSubnet: HostSubnet;
  hosts: Cluster['hosts'];
}

const SubnetHelperText = ({ matchingSubnet, hosts }: SubnetHelperTextProps) => {
  const excludedHosts =
    hosts?.filter(
      (host) =>
        !['disabled', 'disconnected'].includes(host.status) &&
        !matchingSubnet.hostIDs.includes(host.requestedHostname || ''),
    ) || [];

  if (excludedHosts.length === 0) {
    return null;
  }

  const actionLinks = (
    <Popover
      position="right"
      bodyContent={
        <ul>
          {excludedHosts
            .sort(
              (hostA, hostB) =>
                hostA.requestedHostname?.localeCompare(hostB.requestedHostname || '') || 0,
            )
            .map((host) => (
              <li key={host.id}>{host.requestedHostname || host.id}</li>
            ))}
        </ul>
      }
      minWidth="30rem"
      maxWidth="50rem"
    >
      <AlertActionLink id="form-input-hostSubnet-field-helper-view-excluded">{`View ${
        excludedHosts.length
      } affected host${excludedHosts.length > 1 ? 's' : ''}`}</AlertActionLink>
    </Popover>
  );

  return (
    <Alert
      title={'This subnet range is not available on all hosts'}
      variant={AlertVariant.warning}
      actionLinks={actionLinks}
      isInline
    >
      {'Hosts outside of this range will not be included in the new cluster.'}
    </Alert>
  );
};

export interface AvailableSubnetsControlProps {
  hostSubnets: HostSubnets;
  hosts: Host[];
  isRequired: boolean;
}

export const AvailableSubnetsControl = ({
  hostSubnets,
  hosts,
  isRequired = false,
}: AvailableSubnetsControlProps) => {
  const getHelperText = (value: string) => {
    const matchingSubnet = hostSubnets.find((hn) => hn.humanized === value);
    if (matchingSubnet) {
      return <SubnetHelperText matchingSubnet={matchingSubnet} hosts={hosts} />;
    }

    return undefined;
  };

  return (
    <SelectField
      name="hostSubnet"
      label="Available subnets"
      options={
        hostSubnets.length
          ? [
              {
                label: `Please select a subnet. (${hostSubnets.length} available)`,
                value: NO_SUBNET_SET,
                isDisabled: true,
                id: 'form-input-hostSubnet-field-option-no-subnet',
              },
              ...hostSubnets
                .sort((subA, subB) => subA.humanized.localeCompare(subB.humanized))
                .map((hn, index) => ({
                  label: hn.humanized,
                  value: hn.humanized,
                  id: `form-input-hostSubnet-field-option-${index}`,
                })),
            ]
          : [{ label: 'No subnets are currently available', value: NO_SUBNET_SET }]
      }
      getHelperText={getHelperText}
      isDisabled={!hostSubnets.length}
      isRequired={isRequired}
    />
  );
};
