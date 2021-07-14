import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { PopoverIcon, RadioField } from '../../../common';

const GROUP_NAME = 'imageType';

const DiscoveryImageTypeControlGroupLabel = ({
  text,
  popoverContent,
}: {
  text: string;
  popoverContent: string;
}) => (
  <>
    {text}
    <PopoverIcon
      component={'a'}
      variant={'plain'}
      IconComponent={HelpIcon}
      bodyContent={popoverContent}
    />
  </>
);

const DiscoveryImageTypeControlGroup = () => (
  <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
    <FlexItem>
      <RadioField
        name={GROUP_NAME}
        id={'full-iso'}
        value={'full-iso'}
        label={
          <DiscoveryImageTypeControlGroupLabel
            text={'USB drive'}
            popoverContent={'The generated discovery ISO will contain the full image file'}
          />
        }
      />
    </FlexItem>
    <FlexItem spacer={{ default: 'spacer4xl' }} />
    <FlexItem>
      <RadioField
        name={GROUP_NAME}
        id={'minimal-iso'}
        value={'minimal-iso'}
        label={
          <DiscoveryImageTypeControlGroupLabel
            text={'Virtual media'}
            popoverContent={'The generated discovery ISO will contain the minimal image file'}
          />
        }
      />
    </FlexItem>
  </Flex>
);

export default DiscoveryImageTypeControlGroup;
