import React from 'react';
import {
  PageSectionVariants,
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { isSingleClusterMode, routeBasePath } from '../../config';
import { PreviewBadgePosition, TechnologyPreview } from '../ui/PreviewBadge';
import { ocmClient } from '../../api';

type Props = {
  clusterName?: string;
  isHidden?: boolean;
};

const ClusterBreadcrumbs: React.FC<Props> = ({ clusterName, isHidden = isSingleClusterMode() }) =>
  isHidden ? null : (
    <PageSection variant={PageSectionVariants.light}>
      {(clusterName || ocmClient) && (
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={'/'}>Clusters</Link>
          </BreadcrumbItem>
          {clusterName ? (
            <BreadcrumbItem>
              <Link to={`${routeBasePath}/clusters`}>Assisted Clusters</Link>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem isActive>Assisted Clusters</BreadcrumbItem>
          )}
          {clusterName && <BreadcrumbItem isActive>{clusterName}</BreadcrumbItem>}
        </Breadcrumb>
      )}
      <TechnologyPreview
        className="margin-left-md"
        position={clusterName || ocmClient ? PreviewBadgePosition.inline : undefined}
      />
    </PageSection>
  );

export default ClusterBreadcrumbs;
