import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { CheckCircleIcon, CrossIcon } from '@patternfly/react-icons';
import { global_palette_green_500 as okColor } from '@patternfly/react-tokens/dist/js/global_palette_green_500';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';

import { LabelValue } from '../ui/formik/LabelField';

type EnvironmentDetailsProps = {
  title: string;
  name: string;
  baseDomain: string;
  location: string;
  labels: string[];
  enableProxy?: boolean;
  httpProxy?: string;
  httpsProxy?: string;
  noProxy?: string;
  pullSecret?: string;
  sshPublicKey?: string;
  creationDate?: string;
};

const EnvironmentDetails: React.FC<EnvironmentDetailsProps> = ({
  title,
  name,
  baseDomain,
  labels,
  enableProxy,
  httpProxy,
  httpsProxy,
  noProxy,
  pullSecret,
  sshPublicKey,
  creationDate,
  location,
}) => {
  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <Title headingLevel="h1" size={TitleSizes.lg}>
          {title}
        </Title>
      </GridItem>
      <GridItem span={6}>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Infrastructure Environment name</DescriptionListTerm>
            <DescriptionListDescription>{name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Base domain</DescriptionListTerm>
            <DescriptionListDescription>{baseDomain}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Location</DescriptionListTerm>
            <DescriptionListDescription>{location}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Labels</DescriptionListTerm>
            <DescriptionListDescription>
              {labels.map((l) => (
                <LabelValue key={l} value={l} />
              ))}
            </DescriptionListDescription>
          </DescriptionListGroup>
          {creationDate && (
            <DescriptionListGroup>
              <DescriptionListTerm>Created at</DescriptionListTerm>
              <DescriptionListDescription>
                {new Date(creationDate).toString()}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </GridItem>
      <GridItem span={6}>
        <DescriptionList>
          {enableProxy && (
            <>
              <DescriptionListGroup>
                <DescriptionListTerm>HTTP Proxy URL</DescriptionListTerm>
                <DescriptionListDescription>{httpProxy}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>HTTPS Proxy URL</DescriptionListTerm>
                <DescriptionListDescription>{httpsProxy}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>No proxy domains</DescriptionListTerm>
                <DescriptionListDescription>{noProxy}</DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Secret and keys</DescriptionListTerm>
            <DescriptionListDescription>
              <>
                <div>
                  {pullSecret ? (
                    <CheckCircleIcon color={okColor.value} />
                  ) : (
                    <CrossIcon color={warningColor.value} />
                  )}
                  &nbsp;Pull Secret
                </div>
                <div>
                  {sshPublicKey ? (
                    <CheckCircleIcon color={okColor.value} />
                  ) : (
                    <CrossIcon color={warningColor.value} />
                  )}
                  &nbsp;Public SSH Key
                </div>
              </>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
    </Grid>
  );
};

export default EnvironmentDetails;
