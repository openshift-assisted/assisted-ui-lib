import React from 'react';
import _ from 'lodash';
import { ISortBy, SortByDirection, IRow } from '@patternfly/react-table';
import { getHumanizedDateTime } from '../utils';

export type HumanizedSortable = {
  title: string | React.ReactNode;
  sortableValue: number | string;
};

type getCellType = (row: IRow, index: number | undefined) => string | HumanizedSortable;

/**
 * Generates rows array for item which spans across all table columns.
 * Used to put EmptyState etc. components into the table body.
 */
export const getColSpanRow = (content: React.ReactNode, columnCount: number): IRow[] => [
  {
    heightAuto: true,
    cells: [
      {
        props: { colSpan: columnCount },
        title: content,
      },
    ],
  },
];

export const rowSorter = (sortBy: ISortBy, getCell: getCellType) => (a: IRow, b: IRow): number => {
  const coefficient = sortBy.direction === SortByDirection.asc ? 1 : -1;
  const cellA = getCell(a, sortBy.index);
  const cellB = getCell(b, sortBy.index);

  let valA = typeof cellA === 'string' ? cellA : cellA?.sortableValue;
  let valB = typeof cellB === 'string' ? cellB : cellB?.sortableValue;

  if (typeof valA === 'string' || typeof valB === 'string') {
    valA = (valA || '') as string; // handle undefined
    return valA.localeCompare(valB as string) * coefficient;
  }

  // numeric (like timestamp or memory)
  valA = valA || 0; // handle undefined
  valB = valB || 0;
  return (valA - valB) * coefficient;
};

/** Converts string into a sentence by capitalizing first letter and appending with . */
export const toSentence = (s: string) =>
  `${_.upperFirst(s)}${_.endsWith(s, '.') || s === '' ? '' : '.'}`;

export const getDateTimeCell = (time?: string): HumanizedSortable => {
  const date = getHumanizedDateTime(time);
  return {
    title: date,
    sortableValue: time ? new Date(time).getTime() : 0,
  };
};
