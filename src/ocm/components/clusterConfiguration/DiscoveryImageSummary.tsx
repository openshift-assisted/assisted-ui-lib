import React from 'react';
import { Cluster } from '../../../common';
import DownloadIso from '../../../common/components/clusterConfiguration/DownloadIso';
import { getClusterDownloadsImageUrl } from '../../api/clusters';

type DiscoveryImageSummaryProps = {
  cluster: Cluster;
  imageInfo: Cluster['imageInfo'];
  onClose: () => void;
  onReset?: () => void;
};

const DiscoveryImageSummary: React.FC<DiscoveryImageSummaryProps> = ({
  cluster,
  imageInfo,
  ...restProps
}) => {
  const isoPath = getClusterDownloadsImageUrl(cluster.id);
  const isoUrl = `${window.location.origin}${isoPath}`;
  const downloadUrl = imageInfo.downloadUrl || isoUrl;

  return (
    <DownloadIso
      fileName={`discovery_image_${cluster.name}.iso`}
      downloadUrl={downloadUrl}
      {...restProps}
    />
  );
};

export default DiscoveryImageSummary;
