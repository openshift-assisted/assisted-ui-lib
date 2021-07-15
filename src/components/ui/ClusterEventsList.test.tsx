import React from 'react';
import { screen, within } from '@testing-library/react';
import { renderWithRedux } from '../../testUtils';
import ClusterEventsList, { ClusterEventsListProps } from './ClusterEventsList';
import { RootState } from '../../store/rootReducer';
import { ResourceUIState } from '../../types';

// TODO: this fixture needs a warm place where to live in the project.
const props = Object.freeze<ClusterEventsListProps>({
  cluster: {
    hosts: [
      {
        checkedInAt: '2021-01-26T15:37:01.898Z',
        clusterId: 'a8599ae3-58ab-4d5b-829a-b995dd94b7a6',
        connectivity:
          '{"remote_hosts":[{"host_id":"7add9502-0a2b-41f7-9386-ff6e12537ac8","l2_connectivity":[{"outgoing_ip_address":"192.168.141.12","outgoing_nic":"ens4","remote_ip_address":"192.168.126.11","remote_mac":"02:00:00:1f:bd:3e","successful":true},{"outgoing_ip_address":"192.168.126.12","outgoing_nic":"ens3","remote_ip_address":"192.168.126.11","remote_mac":"02:00:00:e1:eb:6b","successful":true},{"outgoing_ip_address":"192.168.126.12","outgoing_nic":"ens3","remote_ip_address":"192.168.141.11","remote_mac":"02:00:00:e1:eb:6b","successful":true},{"outgoing_ip_address":"192.168.141.12","outgoing_nic":"ens4","remote_ip_address":"192.168.141.11","remote_mac":"02:00:00:1f:bd:3e","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::582b:9f5a:5bb:e1f2","remote_mac":"02:00:00:1f:bd:3e","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::52dc:bd24:d937:3ae8","remote_mac":"02:00:00:e1:eb:6b","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::52dc:bd24:d937:3ae8"},{"outgoing_nic":"ens3","remote_ip_address":"fe80::582b:9f5a:5bb:e1f2"}],"l3_connectivity":[{"outgoing_nic":"ens4","remote_ip_address":"fe80::582b:9f5a:5bb:e1f2","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"192.168.126.11","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::52dc:bd24:d937:3ae8","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"192.168.141.11","successful":true}]},{"host_id":"e7a6715a-2e07-4391-9614-f6075d9a1bcc","l2_connectivity":[{"outgoing_ip_address":"192.168.141.12","outgoing_nic":"ens4","remote_ip_address":"192.168.126.10","remote_mac":"02:00:00:99:02:e7","successful":true},{"outgoing_ip_address":"192.168.141.12","outgoing_nic":"ens4","remote_ip_address":"192.168.141.10","remote_mac":"02:00:00:99:02:e7","successful":true},{"outgoing_ip_address":"192.168.126.12","outgoing_nic":"ens3","remote_ip_address":"192.168.126.10","remote_mac":"02:00:00:5b:8a:49","successful":true},{"outgoing_ip_address":"192.168.126.12","outgoing_nic":"ens3","remote_ip_address":"192.168.141.10","remote_mac":"02:00:00:5b:8a:49","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::6383:2b6d:82c6:6132","remote_mac":"02:00:00:99:02:e7","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::d5fc:b055:b92a:a918","remote_mac":"02:00:00:5b:8a:49","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::d5fc:b055:b92a:a918"},{"outgoing_nic":"ens3","remote_ip_address":"fe80::6383:2b6d:82c6:6132"}],"l3_connectivity":[{"outgoing_nic":"ens4","remote_ip_address":"fe80::6383:2b6d:82c6:6132","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"192.168.141.10","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"192.168.126.10","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::d5fc:b055:b92a:a918","successful":true}]}]}',
        createdAt: '2021-01-26T13:54:51.114Z',
        discoveryAgentVersion: 'latest',
        href:
          '/api/assisted-install/v1/clusters/a8599ae3-58ab-4d5b-829a-b995dd94b7a6/hosts/7a6c7f56-d0ab-42d9-8f8a-52cdccf1476e',
        id: '7a6c7f56-d0ab-42d9-8f8a-52cdccf1476e',
        installationDiskPath: '/dev/vda',
        inventory:
          '{"bmc_address":"0.0.0.0","bmc_v6address":"::/0","boot":{"current_boot_mode":"bios"},"cpu":{"architecture":"x86_64","count":4,"flags":["fpu","vme","de","pse","tsc","msr","pae","mce","cx8","apic","sep","mtrr","pge","mca","cmov","pat","pse36","clflush","mmx","fxsr","sse","sse2","ss","syscall","nx","pdpe1gb","rdtscp","lm","constant_tsc","arch_perfmon","rep_good","nopl","xtopology","cpuid","tsc_known_freq","pni","pclmulqdq","vmx","ssse3","fma","cx16","pcid","sse4_1","sse4_2","x2apic","movbe","popcnt","tsc_deadline_timer","aes","xsave","avx","f16c","rdrand","hypervisor","lahf_lm","abm","3dnowprefetch","cpuid_fault","invpcid_single","pti","ssbd","ibrs","ibpb","stibp","tpr_shadow","vnmi","flexpriority","ept","vpid","ept_ad","fsgsbase","tsc_adjust","bmi1","hle","avx2","smep","bmi2","erms","invpcid","rtm","mpx","avx512f","avx512dq","rdseed","adx","smap","clflushopt","clwb","avx512cd","avx512bw","avx512vl","xsaveopt","xsavec","xgetbv1","xsaves","arat","umip","pku","ospke","md_clear","arch_capabilities"],"frequency":2095.104,"model_name":"Intel(R) Xeon(R) Gold 6130 CPU @ 2.10GHz"},"disks":[{"bootable":true,"by_path":"/dev/disk/by-path/pci-0000:00:01.1-ata-1","drive_type":"ODD","hctl":"0:0:0:0","installation_eligibility":{"not_eligible_reasons":["Disk is removable","Disk is too small (disk only has 947 MB, but 10 GB are required)","Drive type is ODD, it must be one of HDD, SSD."]},"is_installation_media":true,"model":"QEMU_DVD-ROM","name":"sr0","path":"/dev/sr0","serial":"QM00001","size_bytes":946864128,"smart":"{\\"json_format_version\\":[1,0],\\"smartctl\\":{\\"version\\":[7,1],\\"svn_revision\\":\\"5022\\",\\"platform_info\\":\\"x86_64-linux-4.18.0-240.10.1.el8_3.x86_64\\",\\"build_info\\":\\"(local build)\\",\\"argv\\":[\\"smartctl\\",\\"--xall\\",\\"--json=c\\",\\"/dev/sr0\\"],\\"exit_status\\":4},\\"device\\":{\\"name\\":\\"/dev/sr0\\",\\"info_name\\":\\"/dev/sr0\\",\\"type\\":\\"scsi\\",\\"protocol\\":\\"SCSI\\"},\\"vendor\\":\\"QEMU\\",\\"product\\":\\"QEMU DVD-ROM\\",\\"model_name\\":\\"QEMU QEMU DVD-ROM\\",\\"revision\\":\\"2.5+\\",\\"scsi_version\\":\\"SPC-3\\",\\"device_type\\":{\\"scsi_value\\":5,\\"name\\":\\"CD/DVD\\"},\\"local_time\\":{\\"time_t\\":1611675423,\\"asctime\\":\\"Tue Jan 26 15:37:03 2021 UTC\\"},\\"temperature\\":{\\"current\\":0,\\"drive_trip\\":0}}","vendor":"QEMU"},{"by_path":"/dev/disk/by-path/pci-0000:00:06.0","drive_type":"HDD","installation_eligibility":{"eligible":true,"not_eligible_reasons":null},"name":"vda","path":"/dev/vda","size_bytes":128849018880,"smart":"{\\"json_format_version\\":[1,0],\\"smartctl\\":{\\"version\\":[7,1],\\"svn_revision\\":\\"5022\\",\\"platform_info\\":\\"x86_64-linux-4.18.0-240.10.1.el8_3.x86_64\\",\\"build_info\\":\\"(local build)\\",\\"argv\\":[\\"smartctl\\",\\"--xall\\",\\"--json=c\\",\\"/dev/vda\\"],\\"messages\\":[{\\"string\\":\\"/dev/vda: Unable to detect device type\\",\\"severity\\":\\"error\\"}],\\"exit_status\\":1}}","vendor":"0x1af4"}],"hostname":"test-infra-cluster-assisted-installer-master-2","interfaces":[{"flags":["up","broadcast","multicast"],"has_carrier":true,"ipv4_addresses":["192.168.126.12/24"],"ipv6_addresses":["fe80::f136:7851:3a94:dbad/64"],"mac_address":"02:00:00:77:d8:e5","mtu":1500,"name":"ens3","product":"0x0001","speed_mbps":-1,"vendor":"0x1af4"},{"flags":["up","broadcast","multicast"],"has_carrier":true,"ipv4_addresses":["192.168.141.12/24"],"ipv6_addresses":["fe80::551e:6986:a8bc:bd44/64"],"mac_address":"02:00:00:4b:69:e5","mtu":1500,"name":"ens4","product":"0x0001","speed_mbps":-1,"vendor":"0x1af4"}],"memory":{"physical_bytes":17809014784,"usable_bytes":17421217792},"system_vendor":{"manufacturer":"Red Hat","product_name":"KVM","virtual":true},"timestamp":1611675423}',
        kind: 'Host',
        logsCollectedAt: '0001-01-01T00:00:00.000Z',
        ntpSources:
          '[{"source_name":"lithium.constant.com","source_state":"unreachable"},{"source_name":"titan.crash-override.org","source_state":"unreachable"},{"source_name":"2606:6680:8:1::d14e:69b8","source_state":"unreachable"},{"source_name":"23-94-219-121-host.colocrossing.com","source_state":"unreachable"},{"source_name":"2620:135:5003:ffff::123","source_state":"unreachable"},{"source_name":"time.cloudflare.com","source_state":"unreachable"},{"source_name":"clock.xmission.com","source_state":"unreachable"},{"source_name":"2604:a880:800:a1::ec9:5001","source_state":"unreachable"},{"source_name":"192.168.126.1","source_state":"synced"}]',
        progress: {
          currentStage: 'Installing',
          stageStartedAt: '0001-01-01T00:00:00.000Z',
          stageUpdatedAt: '0001-01-01T00:00:00.000Z',
        },
        progressStages: [
          'Starting installation',
          'Installing',
          'Writing image to disk',
          'Rebooting',
          'Configuring',
          'Joined',
          'Done',
        ],
        requestedHostname: 'test-infra-cluster-assisted-installer-master-2',
        role: 'master',
        stageStartedAt: '0001-01-01T00:00:00.000Z',
        stageUpdatedAt: '0001-01-01T00:00:00.000Z',
        status: 'known',
        statusInfo: 'Host is ready to be installed',
        statusUpdatedAt: '2021-01-26T13:56:02.219Z',
        updatedAt: '2021-01-26T15:37:14.269Z',
        userName: 'admin',
        validationsInfo:
          '{"hardware":[{"id":"has-inventory","status":"success","message":"Valid inventory exists for the host"},{"id":"has-min-cpu-cores","status":"success","message":"Sufficient CPU cores"},{"id":"has-min-memory","status":"success","message":"Sufficient minimum RAM"},{"id":"has-min-valid-disks","status":"success","message":"Sufficient disk capacity"},{"id":"has-cpu-cores-for-role","status":"success","message":"Sufficient CPU cores for role master"},{"id":"has-memory-for-role","status":"success","message":"Sufficient RAM for role master"},{"id":"hostname-unique","status":"success","message":"Hostname test-infra-cluster-assisted-installer-master-2 is unique in cluster"},{"id":"hostname-valid","status":"success","message":"Hostname test-infra-cluster-assisted-installer-master-2 is allowed"},{"id":"valid-platform","status":"success","message":"Platform KVM is allowed"}],"network":[{"id":"connected","status":"success","message":"Host is connected"},{"id":"machine-cidr-defined","status":"success","message":"Machine Network CIDR is defined"},{"id":"belongs-to-machine-cidr","status":"success","message":"Host belongs to machine network CIDR 192.168.126.0/24"},{"id":"api-vip-connected","status":"success","message":"API VIP connectivity success"},{"id":"belongs-to-majority-group","status":"success","message":"Host has connectivity to the majority of hosts in the cluster"},{"id":"ntp-synced","status":"success","message":"Host NTP is synced"}]}',
      },
      {
        checkedInAt: '2021-01-26T15:36:56.705Z',
        clusterId: 'a8599ae3-58ab-4d5b-829a-b995dd94b7a6',
        connectivity:
          '{"remote_hosts":[{"host_id":"7a6c7f56-d0ab-42d9-8f8a-52cdccf1476e","l2_connectivity":[{"outgoing_ip_address":"192.168.141.11","outgoing_nic":"ens4","remote_ip_address":"192.168.126.12","remote_mac":"02:00:00:4b:69:e5","successful":true},{"outgoing_ip_address":"192.168.141.11","outgoing_nic":"ens4","remote_ip_address":"192.168.141.12","remote_mac":"02:00:00:4b:69:e5","successful":true},{"outgoing_ip_address":"192.168.126.11","outgoing_nic":"ens3","remote_ip_address":"192.168.126.12","remote_mac":"02:00:00:77:d8:e5","successful":true},{"outgoing_ip_address":"192.168.126.11","outgoing_nic":"ens3","remote_ip_address":"192.168.141.12","remote_mac":"02:00:00:77:d8:e5","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::551e:6986:a8bc:bd44","remote_mac":"02:00:00:4b:69:e5","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::f136:7851:3a94:dbad","remote_mac":"02:00:00:77:d8:e5","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::f136:7851:3a94:dbad"},{"outgoing_nic":"ens3","remote_ip_address":"fe80::551e:6986:a8bc:bd44"}],"l3_connectivity":[{"outgoing_nic":"ens4","remote_ip_address":"192.168.141.12","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::551e:6986:a8bc:bd44","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"192.168.126.12","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::f136:7851:3a94:dbad","successful":true}]},{"host_id":"e7a6715a-2e07-4391-9614-f6075d9a1bcc","l2_connectivity":[{"outgoing_ip_address":"192.168.126.11","outgoing_nic":"ens3","remote_ip_address":"192.168.126.10","remote_mac":"02:00:00:5b:8a:49","successful":true},{"outgoing_ip_address":"192.168.141.11","outgoing_nic":"ens4","remote_ip_address":"192.168.141.10","remote_mac":"02:00:00:99:02:e7","successful":true},{"outgoing_ip_address":"192.168.126.11","outgoing_nic":"ens3","remote_ip_address":"192.168.141.10","remote_mac":"02:00:00:5b:8a:49","successful":true},{"outgoing_ip_address":"192.168.141.11","outgoing_nic":"ens4","remote_ip_address":"192.168.126.10","remote_mac":"02:00:00:99:02:e7","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::6383:2b6d:82c6:6132","remote_mac":"02:00:00:99:02:e7","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::d5fc:b055:b92a:a918","remote_mac":"02:00:00:5b:8a:49","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::6383:2b6d:82c6:6132"},{"outgoing_nic":"ens4","remote_ip_address":"fe80::d5fc:b055:b92a:a918"}],"l3_connectivity":[{"outgoing_nic":"ens4","remote_ip_address":"fe80::6383:2b6d:82c6:6132","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"192.168.141.10","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"192.168.126.10","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::d5fc:b055:b92a:a918","successful":true}]}]}',
        createdAt: '2021-01-26T13:54:49.935Z',
        discoveryAgentVersion: 'latest',
        href:
          '/api/assisted-install/v1/clusters/a8599ae3-58ab-4d5b-829a-b995dd94b7a6/hosts/7add9502-0a2b-41f7-9386-ff6e12537ac8',
        id: '7add9502-0a2b-41f7-9386-ff6e12537ac8',
        installationDiskPath: '/dev/vda',
        inventory:
          '{"bmc_address":"0.0.0.0","bmc_v6address":"::/0","boot":{"current_boot_mode":"bios"},"cpu":{"architecture":"x86_64","count":4,"flags":["fpu","vme","de","pse","tsc","msr","pae","mce","cx8","apic","sep","mtrr","pge","mca","cmov","pat","pse36","clflush","mmx","fxsr","sse","sse2","ss","syscall","nx","pdpe1gb","rdtscp","lm","constant_tsc","arch_perfmon","rep_good","nopl","xtopology","cpuid","tsc_known_freq","pni","pclmulqdq","vmx","ssse3","fma","cx16","pcid","sse4_1","sse4_2","x2apic","movbe","popcnt","tsc_deadline_timer","aes","xsave","avx","f16c","rdrand","hypervisor","lahf_lm","abm","3dnowprefetch","cpuid_fault","invpcid_single","pti","ssbd","ibrs","ibpb","stibp","tpr_shadow","vnmi","flexpriority","ept","vpid","ept_ad","fsgsbase","tsc_adjust","bmi1","hle","avx2","smep","bmi2","erms","invpcid","rtm","mpx","avx512f","avx512dq","rdseed","adx","smap","clflushopt","clwb","avx512cd","avx512bw","avx512vl","xsaveopt","xsavec","xgetbv1","xsaves","arat","umip","pku","ospke","md_clear","arch_capabilities"],"frequency":2095.104,"model_name":"Intel(R) Xeon(R) Gold 6130 CPU @ 2.10GHz"},"disks":[{"bootable":true,"by_path":"/dev/disk/by-path/pci-0000:00:01.1-ata-1","drive_type":"ODD","hctl":"0:0:0:0","installation_eligibility":{"not_eligible_reasons":["Disk is removable","Disk is too small (disk only has 947 MB, but 10 GB are required)","Drive type is ODD, it must be one of HDD, SSD."]},"is_installation_media":true,"model":"QEMU_DVD-ROM","name":"sr0","path":"/dev/sr0","serial":"QM00001","size_bytes":946864128,"smart":"{\\"json_format_version\\":[1,0],\\"smartctl\\":{\\"version\\":[7,1],\\"svn_revision\\":\\"5022\\",\\"platform_info\\":\\"x86_64-linux-4.18.0-240.10.1.el8_3.x86_64\\",\\"build_info\\":\\"(local build)\\",\\"argv\\":[\\"smartctl\\",\\"--xall\\",\\"--json=c\\",\\"/dev/sr0\\"],\\"exit_status\\":4},\\"device\\":{\\"name\\":\\"/dev/sr0\\",\\"info_name\\":\\"/dev/sr0\\",\\"type\\":\\"scsi\\",\\"protocol\\":\\"SCSI\\"},\\"vendor\\":\\"QEMU\\",\\"product\\":\\"QEMU DVD-ROM\\",\\"model_name\\":\\"QEMU QEMU DVD-ROM\\",\\"revision\\":\\"2.5+\\",\\"scsi_version\\":\\"SPC-3\\",\\"device_type\\":{\\"scsi_value\\":5,\\"name\\":\\"CD/DVD\\"},\\"local_time\\":{\\"time_t\\":1611675417,\\"asctime\\":\\"Tue Jan 26 15:36:57 2021 UTC\\"},\\"temperature\\":{\\"current\\":0,\\"drive_trip\\":0}}","vendor":"QEMU"},{"by_path":"/dev/disk/by-path/pci-0000:00:06.0","drive_type":"HDD","installation_eligibility":{"eligible":true,"not_eligible_reasons":null},"name":"vda","path":"/dev/vda","size_bytes":128849018880,"smart":"{\\"json_format_version\\":[1,0],\\"smartctl\\":{\\"version\\":[7,1],\\"svn_revision\\":\\"5022\\",\\"platform_info\\":\\"x86_64-linux-4.18.0-240.10.1.el8_3.x86_64\\",\\"build_info\\":\\"(local build)\\",\\"argv\\":[\\"smartctl\\",\\"--xall\\",\\"--json=c\\",\\"/dev/vda\\"],\\"messages\\":[{\\"string\\":\\"/dev/vda: Unable to detect device type\\",\\"severity\\":\\"error\\"}],\\"exit_status\\":1}}","vendor":"0x1af4"}],"hostname":"test-infra-cluster-assisted-installer-master-1","interfaces":[{"flags":["up","broadcast","multicast"],"has_carrier":true,"ipv4_addresses":["192.168.126.11/24"],"ipv6_addresses":["fe80::52dc:bd24:d937:3ae8/64"],"mac_address":"02:00:00:e1:eb:6b","mtu":1500,"name":"ens3","product":"0x0001","speed_mbps":-1,"vendor":"0x1af4"},{"flags":["up","broadcast","multicast"],"has_carrier":true,"ipv4_addresses":["192.168.141.11/24"],"ipv6_addresses":["fe80::582b:9f5a:5bb:e1f2/64"],"mac_address":"02:00:00:1f:bd:3e","mtu":1500,"name":"ens4","product":"0x0001","speed_mbps":-1,"vendor":"0x1af4"}],"memory":{"physical_bytes":17809014784,"usable_bytes":17421217792},"system_vendor":{"manufacturer":"Red Hat","product_name":"KVM","virtual":true},"timestamp":1611675418}',
        kind: 'Host',
        logsCollectedAt: '0001-01-01T00:00:00.000Z',
        ntpSources:
          '[{"source_name":"titan.crash-override.org","source_state":"unreachable"},{"source_name":"time.richiemcintosh.com","source_state":"unreachable"},{"source_name":"ntp.xtom.com.hk","source_state":"unreachable"},{"source_name":"triangle.kansas.net","source_state":"unreachable"},{"source_name":"t2.time.gq1.yahoo.com","source_state":"unreachable"},{"source_name":"time.cloudflare.com","source_state":"unreachable"},{"source_name":"2607:f8f8:721:e301::123","source_state":"unreachable"},{"source_name":"ittybitty.mcdonald.lol","source_state":"unreachable"},{"source_name":"192.168.126.1","source_state":"synced"}]',
        progress: {
          currentStage: 'Installing',
          stageStartedAt: '0001-01-01T00:00:00.000Z',
          stageUpdatedAt: '0001-01-01T00:00:00.000Z',
        },
        progressStages: [
          'Starting installation',
          'Installing',
          'Writing image to disk',
          'Rebooting',
          'Configuring',
          'Joined',
          'Done',
        ],
        requestedHostname: 'test-infra-cluster-assisted-installer-master-1',
        role: 'master',
        stageStartedAt: '0001-01-01T00:00:00.000Z',
        stageUpdatedAt: '0001-01-01T00:00:00.000Z',
        status: 'known',
        statusInfo: 'Host is ready to be installed',
        statusUpdatedAt: '2021-01-26T13:56:02.270Z',
        updatedAt: '2021-01-26T15:37:14.369Z',
        userName: 'admin',
        validationsInfo:
          '{"hardware":[{"id":"has-inventory","status":"success","message":"Valid inventory exists for the host"},{"id":"has-min-cpu-cores","status":"success","message":"Sufficient CPU cores"},{"id":"has-min-memory","status":"success","message":"Sufficient minimum RAM"},{"id":"has-min-valid-disks","status":"success","message":"Sufficient disk capacity"},{"id":"has-cpu-cores-for-role","status":"success","message":"Sufficient CPU cores for role master"},{"id":"has-memory-for-role","status":"success","message":"Sufficient RAM for role master"},{"id":"hostname-unique","status":"success","message":"Hostname test-infra-cluster-assisted-installer-master-1 is unique in cluster"},{"id":"hostname-valid","status":"success","message":"Hostname test-infra-cluster-assisted-installer-master-1 is allowed"},{"id":"valid-platform","status":"success","message":"Platform KVM is allowed"}],"network":[{"id":"connected","status":"success","message":"Host is connected"},{"id":"machine-cidr-defined","status":"success","message":"Machine Network CIDR is defined"},{"id":"belongs-to-machine-cidr","status":"success","message":"Host belongs to machine network CIDR 192.168.126.0/24"},{"id":"api-vip-connected","status":"success","message":"API VIP connectivity success"},{"id":"belongs-to-majority-group","status":"success","message":"Host has connectivity to the majority of hosts in the cluster"},{"id":"ntp-synced","status":"success","message":"Host NTP is synced"}]}',
      },
      {
        checkedInAt: '2021-01-26T15:36:55.691Z',
        clusterId: 'a8599ae3-58ab-4d5b-829a-b995dd94b7a6',
        connectivity:
          '{"remote_hosts":[{"host_id":"7add9502-0a2b-41f7-9386-ff6e12537ac8","l2_connectivity":[{"outgoing_ip_address":"192.168.126.10","outgoing_nic":"ens3","remote_ip_address":"192.168.126.11","remote_mac":"02:00:00:e1:eb:6b","successful":true},{"outgoing_ip_address":"192.168.141.10","outgoing_nic":"ens4","remote_ip_address":"192.168.141.11","remote_mac":"02:00:00:1f:bd:3e","successful":true},{"outgoing_ip_address":"192.168.126.10","outgoing_nic":"ens3","remote_ip_address":"192.168.141.11","remote_mac":"02:00:00:e1:eb:6b","successful":true},{"outgoing_ip_address":"192.168.141.10","outgoing_nic":"ens4","remote_ip_address":"192.168.126.11","remote_mac":"02:00:00:1f:bd:3e","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::582b:9f5a:5bb:e1f2","remote_mac":"02:00:00:1f:bd:3e","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::52dc:bd24:d937:3ae8","remote_mac":"02:00:00:e1:eb:6b","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::582b:9f5a:5bb:e1f2"},{"outgoing_nic":"ens4","remote_ip_address":"fe80::52dc:bd24:d937:3ae8"}],"l3_connectivity":[{"outgoing_nic":"ens3","remote_ip_address":"192.168.126.11","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::582b:9f5a:5bb:e1f2","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"192.168.141.11","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::52dc:bd24:d937:3ae8","successful":true}]},{"host_id":"7a6c7f56-d0ab-42d9-8f8a-52cdccf1476e","l2_connectivity":[{"outgoing_ip_address":"192.168.126.10","outgoing_nic":"ens3","remote_ip_address":"192.168.126.12","remote_mac":"02:00:00:77:d8:e5","successful":true},{"outgoing_ip_address":"192.168.126.10","outgoing_nic":"ens3","remote_ip_address":"192.168.141.12","remote_mac":"02:00:00:77:d8:e5","successful":true},{"outgoing_ip_address":"192.168.141.10","outgoing_nic":"ens4","remote_ip_address":"192.168.126.12","remote_mac":"02:00:00:4b:69:e5","successful":true},{"outgoing_ip_address":"192.168.141.10","outgoing_nic":"ens4","remote_ip_address":"192.168.141.12","remote_mac":"02:00:00:4b:69:e5","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::f136:7851:3a94:dbad","remote_mac":"02:00:00:77:d8:e5","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::551e:6986:a8bc:bd44","remote_mac":"02:00:00:4b:69:e5","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::551e:6986:a8bc:bd44"},{"outgoing_nic":"ens4","remote_ip_address":"fe80::f136:7851:3a94:dbad"}],"l3_connectivity":[{"outgoing_nic":"ens3","remote_ip_address":"192.168.126.12","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"192.168.141.12","successful":true},{"outgoing_nic":"ens4","remote_ip_address":"fe80::551e:6986:a8bc:bd44","successful":true},{"outgoing_nic":"ens3","remote_ip_address":"fe80::f136:7851:3a94:dbad","successful":true}]}]}',
        createdAt: '2021-01-26T13:54:51.181Z',
        discoveryAgentVersion: 'latest',
        href:
          '/api/assisted-install/v1/clusters/a8599ae3-58ab-4d5b-829a-b995dd94b7a6/hosts/e7a6715a-2e07-4391-9614-f6075d9a1bcc',
        id: 'e7a6715a-2e07-4391-9614-f6075d9a1bcc',
        installationDiskPath: '/dev/vda',
        inventory:
          '{"bmc_address":"0.0.0.0","bmc_v6address":"::/0","boot":{"current_boot_mode":"bios"},"cpu":{"architecture":"x86_64","count":4,"flags":["fpu","vme","de","pse","tsc","msr","pae","mce","cx8","apic","sep","mtrr","pge","mca","cmov","pat","pse36","clflush","mmx","fxsr","sse","sse2","ss","syscall","nx","pdpe1gb","rdtscp","lm","constant_tsc","arch_perfmon","rep_good","nopl","xtopology","cpuid","tsc_known_freq","pni","pclmulqdq","vmx","ssse3","fma","cx16","pcid","sse4_1","sse4_2","x2apic","movbe","popcnt","tsc_deadline_timer","aes","xsave","avx","f16c","rdrand","hypervisor","lahf_lm","abm","3dnowprefetch","cpuid_fault","invpcid_single","pti","ssbd","ibrs","ibpb","stibp","tpr_shadow","vnmi","flexpriority","ept","vpid","ept_ad","fsgsbase","tsc_adjust","bmi1","hle","avx2","smep","bmi2","erms","invpcid","rtm","mpx","avx512f","avx512dq","rdseed","adx","smap","clflushopt","clwb","avx512cd","avx512bw","avx512vl","xsaveopt","xsavec","xgetbv1","xsaves","arat","umip","pku","ospke","md_clear","arch_capabilities"],"frequency":2095.104,"model_name":"Intel(R) Xeon(R) Gold 6130 CPU @ 2.10GHz"},"disks":[{"bootable":true,"by_path":"/dev/disk/by-path/pci-0000:00:01.1-ata-1","drive_type":"ODD","hctl":"0:0:0:0","installation_eligibility":{"not_eligible_reasons":["Disk is removable","Disk is too small (disk only has 947 MB, but 10 GB are required)","Drive type is ODD, it must be one of HDD, SSD."]},"is_installation_media":true,"model":"QEMU_DVD-ROM","name":"sr0","path":"/dev/sr0","serial":"QM00001","size_bytes":946864128,"smart":"{\\"json_format_version\\":[1,0],\\"smartctl\\":{\\"version\\":[7,1],\\"svn_revision\\":\\"5022\\",\\"platform_info\\":\\"x86_64-linux-4.18.0-240.10.1.el8_3.x86_64\\",\\"build_info\\":\\"(local build)\\",\\"argv\\":[\\"smartctl\\",\\"--xall\\",\\"--json=c\\",\\"/dev/sr0\\"],\\"exit_status\\":4},\\"device\\":{\\"name\\":\\"/dev/sr0\\",\\"info_name\\":\\"/dev/sr0\\",\\"type\\":\\"scsi\\",\\"protocol\\":\\"SCSI\\"},\\"vendor\\":\\"QEMU\\",\\"product\\":\\"QEMU DVD-ROM\\",\\"model_name\\":\\"QEMU QEMU DVD-ROM\\",\\"revision\\":\\"2.5+\\",\\"scsi_version\\":\\"SPC-3\\",\\"device_type\\":{\\"scsi_value\\":5,\\"name\\":\\"CD/DVD\\"},\\"local_time\\":{\\"time_t\\":1611675416,\\"asctime\\":\\"Tue Jan 26 15:36:56 2021 UTC\\"},\\"temperature\\":{\\"current\\":0,\\"drive_trip\\":0}}","vendor":"QEMU"},{"by_path":"/dev/disk/by-path/pci-0000:00:06.0","drive_type":"HDD","installation_eligibility":{"eligible":true,"not_eligible_reasons":null},"name":"vda","path":"/dev/vda","size_bytes":128849018880,"smart":"{\\"json_format_version\\":[1,0],\\"smartctl\\":{\\"version\\":[7,1],\\"svn_revision\\":\\"5022\\",\\"platform_info\\":\\"x86_64-linux-4.18.0-240.10.1.el8_3.x86_64\\",\\"build_info\\":\\"(local build)\\",\\"argv\\":[\\"smartctl\\",\\"--xall\\",\\"--json=c\\",\\"/dev/vda\\"],\\"messages\\":[{\\"string\\":\\"/dev/vda: Unable to detect device type\\",\\"severity\\":\\"error\\"}],\\"exit_status\\":1}}","vendor":"0x1af4"}],"hostname":"test-infra-cluster-assisted-installer-master-0","interfaces":[{"flags":["up","broadcast","multicast"],"has_carrier":true,"ipv4_addresses":["192.168.126.10/24"],"ipv6_addresses":["fe80::d5fc:b055:b92a:a918/64"],"mac_address":"02:00:00:5b:8a:49","mtu":1500,"name":"ens3","product":"0x0001","speed_mbps":-1,"vendor":"0x1af4"},{"flags":["up","broadcast","multicast"],"has_carrier":true,"ipv4_addresses":["192.168.141.10/24"],"ipv6_addresses":["fe80::6383:2b6d:82c6:6132/64"],"mac_address":"02:00:00:99:02:e7","mtu":1500,"name":"ens4","product":"0x0001","speed_mbps":-1,"vendor":"0x1af4"}],"memory":{"physical_bytes":17809014784,"usable_bytes":17421201408},"system_vendor":{"manufacturer":"Red Hat","product_name":"KVM","virtual":true},"timestamp":1611675416}',
        kind: 'Host',
        logsCollectedAt: '0001-01-01T00:00:00.000Z',
        ntpSources:
          '[{"source_name":"2606:6680:8:1::d14e:69b8","source_state":"unreachable"},{"source_name":"44.190.6.254","source_state":"unreachable"},{"source_name":"024-182-232-106.biz.spectrum.com","source_state":"unreachable"},{"source_name":"jikan.ae7.st","source_state":"unreachable"},{"source_name":"2604:a880:800:a1::ec9:5001","source_state":"unreachable"},{"source_name":"clock.xmission.com","source_state":"unreachable"},{"source_name":"time.cloudflare.com","source_state":"unreachable"},{"source_name":"2620:135:5003:ffff::123","source_state":"unreachable"},{"source_name":"192.168.126.1","source_state":"synced"}]',
        progress: {
          currentStage: 'Installing',
          stageStartedAt: '0001-01-01T00:00:00.000Z',
          stageUpdatedAt: '0001-01-01T00:00:00.000Z',
        },
        progressStages: [
          'Starting installation',
          'Installing',
          'Writing image to disk',
          'Rebooting',
          'Configuring',
          'Joined',
          'Done',
        ],
        requestedHostname: 'test-infra-cluster-assisted-installer-master-0',
        role: 'master',
        stageStartedAt: '0001-01-01T00:00:00.000Z',
        stageUpdatedAt: '0001-01-01T00:00:00.000Z',
        status: 'known',
        statusInfo: 'Host is ready to be installed',
        statusUpdatedAt: '2021-01-26T13:56:02.454Z',
        updatedAt: '2021-01-26T15:37:14.462Z',
        userName: 'admin',
        validationsInfo:
          '{"hardware":[{"id":"has-inventory","status":"success","message":"Valid inventory exists for the host"},{"id":"has-min-cpu-cores","status":"success","message":"Sufficient CPU cores"},{"id":"has-min-memory","status":"success","message":"Sufficient minimum RAM"},{"id":"has-min-valid-disks","status":"success","message":"Sufficient disk capacity"},{"id":"has-cpu-cores-for-role","status":"success","message":"Sufficient CPU cores for role master"},{"id":"has-memory-for-role","status":"success","message":"Sufficient RAM for role master"},{"id":"hostname-unique","status":"success","message":"Hostname test-infra-cluster-assisted-installer-master-0 is unique in cluster"},{"id":"hostname-valid","status":"success","message":"Hostname test-infra-cluster-assisted-installer-master-0 is allowed"},{"id":"valid-platform","status":"success","message":"Platform KVM is allowed"}],"network":[{"id":"connected","status":"success","message":"Host is connected"},{"id":"machine-cidr-defined","status":"success","message":"Machine Network CIDR is defined"},{"id":"belongs-to-machine-cidr","status":"success","message":"Host belongs to machine network CIDR 192.168.126.0/24"},{"id":"api-vip-connected","status":"success","message":"API VIP connectivity success"},{"id":"belongs-to-majority-group","status":"success","message":"Host has connectivity to the majority of hosts in the cluster"},{"id":"ntp-synced","status":"success","message":"Host NTP is synced"}]}',
      },
    ],
    href: '/api/assisted-install/v1/clusters/a8599ae3-58ab-4d5b-829a-b995dd94b7a6',
    id: 'a8599ae3-58ab-4d5b-829a-b995dd94b7a6',
    imageInfo: {},
    kind: 'Cluster',
    status: 'ready',
    statusInfo: 'Cluster ready to be installed',
  },
  events: [
    {
      clusterId: 'a8599ae3-58ab-4d5b-829a-b995dd94b7a6',
      eventTime: '2021-01-26T13:53:26.560Z',
      message: 'some info msg',
      severity: 'info',
    },
    {
      clusterId: 'b8599ae3-58ab-4d5b-829a-b995dd94b7a6',
      eventTime: '2021-01-26T13:53:26.566Z',
      message: 'some warning msg',
      severity: 'warning',
    },
    {
      clusterId: 'c8599ae3-58ab-4d5b-829a-b995dd94b7a6',
      eventTime: '2021-01-26T13:53:28.391Z',
      message: 'some error msg',
      severity: 'error',
    },
    {
      clusterId: 'd8599ae3-58ab-4d5b-829a-b995dd94b7a6',
      eventTime: '2021-01-26T13:53:28.391Z',
      message: 'some critical msg',
      severity: 'critical',
    },
  ],
});

describe('<ClusterEventsList />', () => {
  it('Renders without crashing', () => {
    const preloadedState: RootState = {
      clusters: {
        data: [],
        uiState: ResourceUIState.LOADED,
      },
      currentCluster: {
        data: { ...props.cluster },
        uiState: ResourceUIState.LOADED,
        isReloadScheduled: 0,
      },
    };
    renderWithRedux(<ClusterEventsList {...props} />, { preloadedState });
    const element = screen.queryByPlaceholderText(/Filter by text/i);
    expect(element).toBeTruthy();
  });

  describe('Severity filter', () => {
    it("Given that more than one filter is selected, unchecking one item doesn't uncheck the rest", () => {
      renderWithRedux(<ClusterEventsList {...props} />);

      // open the severity filter menu
      const severityFilter = screen.getByText(/Severity/i);
      severityFilter.click();

      // check all the severity checkboxes
      const labels = screen.getAllByTestId(/(info|warning|error|critical)-filter-option/i);
      labels.forEach((label) => label.click());

      const allFilterOptionsAreChecked = labels.every((label) => {
        const checkbox = within(label).getByRole('checkbox', {
          name: /(info|warning|error|critical)/i,
        }) as HTMLInputElement;
        return checkbox.checked;
      });
      expect(allFilterOptionsAreChecked).toBe<boolean>(true);

      // uncheck the error severity filter
      const errorLabel = screen.getByTestId('error-filter-option');
      errorLabel.click();

      const errorFilterOption = within(errorLabel).getByRole('checkbox', {
        name: /error/i,
      }) as HTMLInputElement;
      expect(errorFilterOption.checked).toBe<boolean>(false);

      const allOtherFilterOptionsAreChecked = labels
        .filter((label) => label.attributes['data-testid'] !== errorLabel.attributes['data-testid'])
        .every((otherLabel) => {
          return (within(otherLabel).getByRole('checkbox') as HTMLInputElement).checked;
        });
      expect(allOtherFilterOptionsAreChecked).toBe<boolean>(true);
    });
  });

  describe('Hosts filter', () => {
    it("Given that 'cluster-level' events and 'deleted hosts' options are selected exclusively; selecting one of the hosts won't activate the 'select all' checkbox", () => {
      renderWithRedux(<ClusterEventsList {...props} />);

      // open the hosts filter menu
      const hostsFilter = screen.getByRole('button', { name: /hosts/i });
      hostsFilter.click();

      // verify all the checkboxes are not selected
      const selectAllCheckbox = screen.getByRole('checkbox', {
        name: /select all/i,
      }) as HTMLInputElement;
      selectAllCheckbox.click();

      // select only 'cluster-level' and 'deleted hosts'
      const clusterLevelCheckbox = screen.getByRole('checkbox', {
        name: /cluster-level events/i,
      });
      clusterLevelCheckbox.click();

      // select one of the hosts
      const someHostCheckbox = screen.getByRole('checkbox', {
        name: /test-infra-cluster-assisted-installer-master-2/i,
      });
      someHostCheckbox.click();

      // assert 'select all' option is not selected
      expect(selectAllCheckbox.checked).toBe<boolean>(false);
    });
  });
});
