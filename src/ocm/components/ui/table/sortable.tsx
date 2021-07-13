/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { SortColumn, SortByDirection, IExtra, ITransform } from '@patternfly/react-table';
import { css } from '@patternfly/react-styles';

/**
 * Custom implementation of @patternfly/react-table 's sortable transform decorator
 * which correctly sets button type on SortColumn
 * TODO(jtomasek): remove this once fix is released https://github.com/patternfly/patternfly-react/pull/4252
 */

const sortable: ITransform = (label, extra: IExtra | undefined) => {
  const { columnIndex, column, property } = extra!;
  const {
    extraParams: { sortBy, onSort },
  } = column!;

  const extraData = {
    columnIndex,
    column,
    property,
  };

  const isSortedBy = sortBy && columnIndex === sortBy.index;
  /**
   * @param {React.MouseEvent} event - React mouse event
   */
  function sortClicked(event: React.MouseEvent) {
    let reversedDirection: SortByDirection;
    if (!isSortedBy) {
      reversedDirection = SortByDirection.asc;
    } else {
      reversedDirection =
        sortBy?.direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
    }
    // tslint:disable-next-line:no-unused-expression
    onSort && onSort(event, columnIndex!, reversedDirection, extraData);
  }

  return {
    className: css('pf-c-table__sort', isSortedBy && 'pf-m-selected'),
    'aria-sort': isSortedBy ? `${sortBy?.direction}ending` : 'none',
    children: (
      <SortColumn
        isSortedBy={isSortedBy}
        sortDirection={isSortedBy ? sortBy?.direction : ''}
        onSort={sortClicked}
        // eslint-disable-next-line
        // @ts-ignore
        type="button"
      >
        {label}
      </SortColumn>
    ),
  };
};

export default sortable;
