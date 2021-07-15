import React from 'react';
import { Text } from '@patternfly/react-core';

const DiscoveryInstructions = ({
  isSingleNodeCluster = false,
}: {
  isSingleNodeCluster: boolean;
}) => (
  <>
    <Text component="h3">Instructions</Text>
    <Text component="p">
      Generate a Discovery ISO and use a bootable device (local Disk, USB drive, etc.) or network
      booting (PXE) to <b>boot once</b> your {`${isSingleNodeCluster ? 'machine' : 'machines'}`}{' '}
      from it on hardware that should become part of this OCP cluster.
      <br />
      Hosts connected to the internet with a valid IP address will appear in the table below.
    </Text>
  </>
);

export default DiscoveryInstructions;
