import React from 'react';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import {
  ActionGroup,
  Button,
  ButtonVariant,
  ClipboardCopy,
  clipboardCopyFunc,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { getAssistedServiceIsoUrl } from '../../api/assistedServiceIso';
import { ImageInfo } from '../../api/types';
import { DetailItem, DetailList } from '../ui/DetailList';

type AssistedInstallerDownloadImageInfoProps = {
  imageInfo: ImageInfo;
  onReset: () => void;
};
const AssistedInstallerDownloadImageInfo: React.FC<AssistedInstallerDownloadImageInfoProps> = ({
  imageInfo,
  onReset,
}) => {
  const isoPath = getAssistedServiceIsoUrl();
  const isoUrl = `${window.location.origin}${isoPath}`;
  const downloadUrl = imageInfo.downloadUrl || isoUrl;

  const wgetCommand = `wget -O 'assisted_installer.iso' '${downloadUrl}'`;
  return (
    <Grid hasGutter>
      <GridItem lg={8}>
        <TextContent>
          <Text component={TextVariants.h2}>Download and run</Text>
          <Text component={TextVariants.p}>
            Boot the ISO on a local device and visit its IP address with a web browser to view the
            Assisted Installer user interface.
          </Text>
        </TextContent>
      </GridItem>
      <GridItem lg={8}>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Assisted Installer ISO URL</DescriptionListTerm>
            <DescriptionListDescription>
              <ClipboardCopy isReadOnly onCopy={(event) => clipboardCopyFunc(event, downloadUrl)}>
                {downloadUrl}
              </ClipboardCopy>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Command to download the ISO</DescriptionListTerm>
            <DescriptionListDescription>
              <ClipboardCopy isReadOnly onCopy={(event) => clipboardCopyFunc(event, wgetCommand)}>
                {wgetCommand}
              </ClipboardCopy>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </GridItem>
      <GridItem lg={8}>
        <div className="pf-c-action-list">
          <div className="pf-c-action-list__item">
            <Button
              variant={ButtonVariant.primary}
              onClick={() => saveAs(downloadUrl)}
              data-test-id="download-iso-btn"
            >
              Download Assisted Installer ISO
            </Button>
          </div>
          <div className="pf-c-action-list__item">
            <Button
              variant={ButtonVariant.secondary}
              component={(props) => (
                <Link to={`/install/metal`} {...props}>
                  Back
                </Link>
              )}
            />
          </div>
          <div className="pf-c-action-list__item">
            <Button variant={ButtonVariant.link} onClick={onReset} data-test-id="edit-iso-btn">
              Edit ISO configuration
            </Button>
          </div>
        </div>
      </GridItem>
    </Grid>
  );
};

export default AssistedInstallerDownloadImageInfo;
