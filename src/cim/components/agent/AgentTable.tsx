import * as React from 'react';
import * as _ from 'lodash';
import { expandable, IRow, sortable } from '@patternfly/react-table';
import { Button, Popover, Stack, StackItem } from '@patternfly/react-core';

import { HostDetail } from '../../../components/hosts/HostRowDetail';
import HostPropertyValidationPopover from '../../../components/hosts/HostPropertyValidationPopover';
import HostStatus from '../../../components/hosts/HostStatus';
import RoleCell from '../../../components/hosts/RoleCell';
import Hostname from '../../../components/hosts/Hostname';
import { getHostname, getHostRole, getInventory } from '../../../components/hosts/utils';
import { getHostRowHardwareInfo } from '../../../components/hosts/hardwareInfo';
import { Host, stringToJSON } from '../../../api';
import { ValidationsInfo } from '../../../types/hosts';
import { getDateTimeCell } from '../../../components/ui/table/utils';
import HostsTable, { OpenRows } from '../../../components/hosts/HostsTable';
import { editHost, EditHostModal } from '../../../components';
import { agentToHost } from '../../utils/agentHost';
import { Agent } from '../../types/k8s';
import {
  ModalDialogsContextProvider,
  useModalDialogsContext,
} from '../../../components/hosts/ModalDialogsContext';

const columns = [
  { title: 'Hostname', transforms: [sortable], cellFormatters: [expandable] },
  { title: 'Role', transforms: [sortable] },
  { title: 'Status', transforms: [sortable] },
  { title: 'Discovered At', transforms: [sortable] },
  { title: 'CPU Cores', transforms: [sortable] }, // cores per machine (sockets x cores)
  { title: 'Memory', transforms: [sortable] },
  { title: 'Disk', transforms: [sortable] },
  { title: '' },
];

type TableRows = (
  agents: Agent[],
  host: Host,
  openRows: OpenRows,
  onEditHostname: (agent: Agent) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditRole: (agent: Agent, role?: string) => Promise<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onApprove: (agent: Agent) => Promise<any>,
) => (IRow & { host: Host })[];

const hostToHostTableRow: TableRows = (
  agents,
  host,
  openRows,
  onEditHostname,
  onEditRole,
  onApprove,
) => {
  const { id, status, createdAt } = host;
  const agent = agents.find((a) => a.metadata?.uid === host.id) as Agent;
  const inventory = getInventory(host);
  const { cores, memory, disk } = getHostRowHardwareInfo(inventory);
  const validationsInfo = stringToJSON<ValidationsInfo>(host.validationsInfo) || {};
  const memoryValidation = validationsInfo?.hardware?.find((v) => v.id === 'has-memory-for-role');
  const diskValidation = validationsInfo?.hardware?.find((v) => v.id === 'has-min-valid-disks');
  const cpuCoresValidation = validationsInfo?.hardware?.find(
    (v) => v.id === 'has-cpu-cores-for-role',
  );
  const computedHostname = getHostname(host);
  const hostRole = getHostRole(host);
  const dateTimeCell = getDateTimeCell(createdAt);

  const editHostname = onEditHostname ? () => onEditHostname(agent) : undefined;
  const editRole = onEditRole ? (role?: string) => onEditRole(agent, role) : undefined;

  return [
    {
      // visible row
      isOpen: !!openRows[id],
      cells: [
        {
          title: <Hostname host={host} onEditHostname={editHostname} />,
          props: { 'data-testid': 'host-name' },
          sortableValue: computedHostname || '',
        },
        {
          title: <RoleCell host={host} readonly={false} role={hostRole} onEditRole={editRole} />,
          props: { 'data-testid': 'host-role' },
          sortableValue: hostRole,
        },
        {
          title: (
            <Stack>
              <StackItem>
                <HostStatus
                  host={host}
                  onEditHostname={editHostname}
                  validationsInfo={validationsInfo}
                />
              </StackItem>
              {!agent.spec.approved && (
                <StackItem>
                  <Popover
                    aria-label="Approve host popover"
                    minWidth="30rem"
                    maxWidth="50rem"
                    headerContent={<div>Approve host to join infrastructure environment</div>}
                    bodyContent={
                      <>
                        <div>Approve host to add it to the infrastructure environment.</div>
                        <div>
                          Make sure that you expect and recognize the host before approving.
                        </div>
                      </>
                    }
                    footerContent={
                      <Button variant="link" onClick={() => onApprove(agent)} isInline>
                        Approve host
                      </Button>
                    }
                  >
                    <Button variant="link" isInline>
                      Approve host
                    </Button>
                  </Popover>
                </StackItem>
              )}
            </Stack>
          ),
          props: { 'data-testid': 'host-status' },
          sortableValue: status,
        },
        {
          title: dateTimeCell.title,
          props: { 'data-testid': 'host-discovered-time' },
          sortableValue: dateTimeCell.sortableValue,
        },
        {
          title: (
            <HostPropertyValidationPopover validation={cpuCoresValidation}>
              {cores.title}
            </HostPropertyValidationPopover>
          ),
          props: { 'data-testid': 'host-cpu-cores' },
          sortableValue: cores.sortableValue,
        },
        {
          title: (
            <HostPropertyValidationPopover validation={memoryValidation}>
              {memory.title}
            </HostPropertyValidationPopover>
          ),
          props: { 'data-testid': 'host-memory' },
          sortableValue: memory.sortableValue,
        },
        {
          title: (
            <HostPropertyValidationPopover validation={diskValidation}>
              {disk.title}
            </HostPropertyValidationPopover>
          ),
          props: { 'data-testid': 'host-disks' },
          sortableValue: disk.sortableValue,
        },
      ],
      host,
      key: `${host.id}-master`,
    },
    {
      // expandable detail
      // parent will be set after sorting
      fullWidth: true,
      cells: [
        {
          title: (
            <HostDetail
              key={id}
              canEditDisks={() => false}
              inventory={inventory}
              host={host}
              validationsInfo={validationsInfo}
            />
          ),
        },
      ],
      host,
      key: `${host.id}-detail`,
    },
  ];
};

type AgentTableProps = {
  agents: Agent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditHostname: (agent: Agent, hostname: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditRole: (agent: Agent, role?: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onApprove: (agent: Agent) => Promise<any>;
};

const AgentTable: React.FC<AgentTableProps> = ({
  agents,
  onEditHostname,
  onEditRole,
  onApprove,
}) => {
  const { editHostDialog } = useModalDialogsContext();
  const hosts = agents.map(agentToHost);
  const usedHostnames = _.compact(hosts.map(getHostname));

  const actions = [
    editHost((host) => {
      editHostDialog.open({
        host,
        usedHostnames,
        onSave: ({ hostId, hostname }) =>
          onEditHostname(agents.find((a) => a.metadata?.uid === hostId) as Agent, hostname),
      });
    }),
  ];

  return (
    <>
      <HostsTable
        hosts={hosts}
        EmptyState={() => <div>no hosts</div>}
        columns={columns}
        actions={actions}
        hostToHostTableRow={(host, openRows) =>
          hostToHostTableRow(
            agents,
            host,
            openRows,
            (agent) => {
              editHostDialog.open({
                host,
                usedHostnames,
                onSave: ({ hostname }) => onEditHostname(agent, hostname),
              });
            },
            onEditRole,
            onApprove,
          )
        }
      />
      <EditHostModal />
    </>
  );
};

// eslint-disable-next-line
export default (props: AgentTableProps) => (
  <ModalDialogsContextProvider>
    <AgentTable {...props} />
  </ModalDialogsContextProvider>
);
