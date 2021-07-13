import React from 'react';
import _ from 'lodash';
import {
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarFilter,
  ToolbarChip,
  Button,
  ButtonVariant,
  InputGroup,
  Select,
  SelectOption,
  TextInput,
  ToolbarProps,
  ToolbarFilterProps,
  SelectProps,
  TextInputProps,
  Badge,
} from '@patternfly/react-core';
import { SearchIcon, FilterIcon } from '@patternfly/react-icons';
import { Host, Event, Cluster, Inventory, stringToJSON, EVENT_SEVERITIES } from '../../../common';

import './ClusterEventsToolbar.css';

export type ClusterEventsFiltersType = {
  fulltext: string;
  hosts: Host['id'][];
  severity: Event['severity'][];
  clusterLevel: boolean;
  orphanedHosts: boolean;
  selectAll: boolean;
};

type ClustersListToolbarProps = {
  filters: ClusterEventsFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ClusterEventsFiltersType>>;
  cluster: Cluster;
  events: Event[];
};

const Placeholder = ({ text }: { text: string }) => (
  <>
    <FilterIcon /> {text}
  </>
);

const SELECT_ALL = 'select-all-actions';
const CLUSTER_LEVEL = 'cluster-level-action';
const ORPHANS = 'deleted-hosts-action';

const mapHosts = (hosts: Cluster['hosts']) =>
  (hosts || []).map((host) => {
    const inventory = stringToJSON<Inventory>(host.inventory) || {};
    let hostname = host.requestedHostname;
    if (inventory.hostname !== host.requestedHostname) {
      hostname += ` (${inventory.hostname})`;
    }
    return {
      hostname,
      id: host.id,
    };
  });

export const getInitialClusterEventsFilters = (cluster: Cluster): ClusterEventsFiltersType => ({
  fulltext: '',
  hosts: mapHosts(cluster.hosts).map((host) => host.id),
  severity: [],
  clusterLevel: true,
  orphanedHosts: true,
  selectAll: true,
});

const getEventsCount = (severity: Event['severity'], events: Event[]) =>
  events.filter((event) => event.severity === severity).length;

const ClusterEventsToolbar: React.FC<ClustersListToolbarProps> = ({
  filters,
  setFilters,
  cluster,
  events,
}) => {
  const [isHostExpanded, setHostExpanded] = React.useState(false);
  const [isSeverityExpanded, setSeverityExpanded] = React.useState(false);

  const allHosts = React.useMemo(() => mapHosts(cluster.hosts), [cluster.hosts]);
  const onClearAllFilters: ToolbarProps['clearAllFilters'] = () => {
    setFilters(getInitialClusterEventsFilters(cluster));
  };

  const onSelect = (
    type: 'hosts' | 'severity',
    isChecked: boolean,
    value: Host['id'] | Event['severity'],
  ) => {
    const setNextSelectedValues = (
      type: 'hosts' | 'severity',
      isChecked: boolean,
      value: Host['id'] | Event['severity'],
      filters: ClusterEventsFiltersType,
    ) => ({
      ...filters,
      [type]: isChecked
        ? [...filters[type], value]
        : filters[type].filter((val: string) => val !== value),
    });

    const setNextSelectAllValue = (
      totalHostsInCluster: number,
      filters: ClusterEventsFiltersType,
    ) => ({
      ...filters,
      selectAll:
        type === 'severity'
          ? filters.selectAll
          : filters.hosts.length === totalHostsInCluster &&
            filters.orphanedHosts &&
            filters.clusterLevel,
    });

    let nextFilters = setNextSelectedValues(type, isChecked, value, filters);
    nextFilters = setNextSelectAllValue(cluster.hosts?.length || 0, nextFilters);

    setFilters(nextFilters);
  };

  const onHostToggle: SelectProps['onToggle'] = () => setHostExpanded(!isHostExpanded);
  const onHostSelect: SelectProps['onSelect'] = (event, value) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const isChecked = event.target.checked;

    switch (value) {
      case SELECT_ALL:
        if (isChecked) {
          setFilters({
            ...filters,
            hosts: mapHosts(cluster.hosts).map((host) => host.id),
            clusterLevel: true,
            orphanedHosts: true,
            selectAll: true,
          });
        } else {
          setFilters({
            ...filters,
            clusterLevel: false,
            orphanedHosts: false,
            selectAll: false,
            hosts: [],
          });
        }
        break;
      case ORPHANS:
        setFilters({
          ...filters,
          orphanedHosts: isChecked,
          selectAll:
            isChecked && filters.clusterLevel && filters.hosts.length === cluster.hosts?.length,
        });
        break;
      case CLUSTER_LEVEL:
        setFilters({
          ...filters,
          clusterLevel: isChecked,
          selectAll:
            isChecked && filters.orphanedHosts && filters.hosts.length === cluster.hosts?.length,
        });
        break;
      default:
        onSelect('hosts', isChecked, value as string);
    }
  };

  const onSeverityToggle: SelectProps['onToggle'] = () => setSeverityExpanded(!isSeverityExpanded);
  const onSeveritySelect: SelectProps['onSelect'] = (event, value) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    onSelect('severity', event.target.checked, value as string);
  };

  const onFulltextChange: TextInputProps['onChange'] = (fulltext) => {
    setFilters({
      ...filters,
      fulltext,
    });
  };

  const onDeleteChip: ToolbarFilterProps['deleteChip'] = (type, chip) => {
    if (type) {
      const id = chip['key'] || chip;
      setFilters({
        ...filters,
        [type as string]: filters[type as string].filter((v: string) => v !== id),
      });
    } else {
      onClearAllFilters();
    }
  };

  const onDeleteChipGroup: ToolbarFilterProps['deleteChipGroup'] = (type) => {
    setFilters({
      ...filters,
      [type as string]: [],
    });
  };

  const getSelections = (): string[] => {
    let selections = filters.clusterLevel ? [...filters.hosts, CLUSTER_LEVEL] : filters.hosts;
    selections = filters.orphanedHosts ? [...selections, ORPHANS] : selections;
    selections = filters.selectAll ? [...selections, SELECT_ALL] : selections;

    return selections;
  };

  return (
    <Toolbar
      id="clusters-events-toolbar"
      className="pf-m-toggle-group-container"
      collapseListedFiltersBreakpoint="xl"
      clearAllFilters={onClearAllFilters}
    >
      <ToolbarContent>
        <ToolbarFilter categoryName="hosts">
          <Select
            variant="checkbox"
            aria-label="hosts"
            onToggle={onHostToggle}
            onSelect={onHostSelect}
            selections={getSelections()}
            customBadgeText={filters.hosts?.length || 0}
            isOpen={isHostExpanded}
            placeholderText={<Placeholder text="Hosts" />}
            isDisabled={allHosts.length === 0}
          >
            {[
              <SelectOption inputId={`checkbox-${SELECT_ALL}`} key={SELECT_ALL} value={SELECT_ALL}>
                Select All
              </SelectOption>,
              <SelectOption
                inputId={`checkbox-${CLUSTER_LEVEL}`}
                key={CLUSTER_LEVEL}
                value={CLUSTER_LEVEL}
              >
                Cluster-level events
              </SelectOption>,
              <SelectOption inputId={`checkbox-${ORPHANS}`} key={ORPHANS} value={ORPHANS}>
                Deleted hosts
              </SelectOption>,
              ...allHosts.map((host) => (
                <SelectOption key={host.id} value={host.id}>
                  {host.hostname}
                </SelectOption>
              )),
            ]}
          </Select>
        </ToolbarFilter>

        <ToolbarFilter
          chips={filters.severity.map(
            (severity): ToolbarChip => ({
              key: severity,
              node: _.capitalize(severity),
            }),
          )}
          deleteChip={onDeleteChip}
          deleteChipGroup={onDeleteChipGroup}
          categoryName="severity"
        >
          <Select
            variant="checkbox"
            aria-label="Severity"
            onToggle={onSeverityToggle}
            onSelect={onSeveritySelect}
            selections={filters.severity}
            isOpen={isSeverityExpanded}
            placeholderText={<Placeholder text="Severity" />}
          >
            {EVENT_SEVERITIES.map((severity) => (
              <SelectOption
                data-testid={`${severity}-filter-option`}
                key={severity}
                value={severity}
              >
                {_.capitalize(severity)} <Badge isRead>{getEventsCount(severity, events)}</Badge>
              </SelectOption>
            ))}
          </Select>
        </ToolbarFilter>

        <ToolbarItem>
          <InputGroup>
            <TextInput
              name="search-text"
              id="search-text"
              type="search"
              aria-label="text to be searched"
              onChange={onFulltextChange}
              value={filters.fulltext}
              placeholder="Filter by text ..."
            />
            <Button variant={ButtonVariant.control} aria-label="search text button">
              <SearchIcon />
            </Button>
          </InputGroup>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default ClusterEventsToolbar;
