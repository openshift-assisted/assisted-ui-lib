import React, { ReactChild } from 'react';
import {
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Text,
  TextProps,
} from '@patternfly/react-core';

import './DetailList.css';
import { WithTestID } from '../../../common';

export type DetailListProps = {
  children: ReactChild | (ReactChild | undefined)[];
  title?: string;
  titleComponent?: TextProps['component'];
};

export type DetailItemProps = {
  title: string;
  value?:
    | {
        title: string;
        value?: string;
      }[]
    | React.ReactNode;
  idPrefix?: string;
  isHidden?: boolean;
  classNameValue?: string;
};

export const DetailList: React.FC<DetailListProps> = ({
  children,
  title,
  titleComponent = 'h2',
}) => (
  <TextContent>
    {title && <Text component={titleComponent}>{title}</Text>}
    <TextList component={TextListVariants.dl} className="detail-list">
      {children}
    </TextList>
  </TextContent>
);

export const DetailItem: React.FC<DetailItemProps & WithTestID> = ({
  title,
  value = '',
  idPrefix,
  testId,
  isHidden = false,
  classNameValue,
}) =>
  isHidden ? null : (
    <>
      <TextListItem
        component={TextListItemVariants.dt}
        id={idPrefix ? `${idPrefix}-title` : undefined}
        data-testid={testId ? `${testId}-title` : undefined}
      >
        {title}
      </TextListItem>
      <TextListItem
        component={TextListItemVariants.dd}
        id={idPrefix ? `${idPrefix}-value` : undefined}
        data-testid={testId ? `${testId}-value` : undefined}
        className={classNameValue}
      >
        {Array.isArray(value) ? (
          <TextList component={TextListVariants.dl}>
            {value.map((item, idx) => [
              <TextListItem
                data-testid={testId ? `${testId}-title-${idx}` : undefined}
                key={item.title}
                component={TextListItemVariants.dt}
              >
                {item.title}
              </TextListItem>,
              <TextListItem
                data-testid={testId ? `${testId}-value-${idx}` : undefined}
                key={`dd-${item.title}`}
                component={TextListItemVariants.dd}
              >
                {item.value}
              </TextListItem>,
            ])}
          </TextList>
        ) : (
          value
        )}
      </TextListItem>
    </>
  );
