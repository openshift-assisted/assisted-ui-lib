// TODO(jtomasek): replace this module with transforms from @patternfly/react-table
// when available
import { ITransform } from '@patternfly/react-table';

import './wrappable.css';

export const breakWord: ITransform = () => ({
  className: 'pf-m-break-word',
});

export const fitContent: ITransform = () => ({
  className: 'pf-m-fit-content',
});

export const nowrap: ITransform = () => ({
  className: 'pf-m-nowrap',
});

export const truncate: ITransform = () => ({
  className: 'pf-m-truncate',
});

export const wrappable: ITransform = () => ({
  className: 'pf-m-wrap',
});

export const noPadding: ITransform = () => ({
  className: 'table-no-padding',
});
