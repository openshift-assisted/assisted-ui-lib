export type ClusterDetailsValues = {
  name: string;
  highAvailabilityMode: 'Full' | 'None';
  openshiftVersion: string;
  pullSecret: string;
  baseDnsDomain: string;

  SNODisclaimer: boolean;
  useRedHatDnsService: boolean;
};
