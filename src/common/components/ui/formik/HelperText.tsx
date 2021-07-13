import React from 'react';
import { css } from '@patternfly/react-styles';

type HelperTextProps = {
  fieldId: string;
  isError?: boolean;
};

/**
 * HelperText component standardizes the format of non string helperText prop on FormGroup
 * which is otherwise rendered 'as is' in FormGroup
 */
const HelperText: React.FC<HelperTextProps> = ({ fieldId, children, isError = false }) => (
  <div
    className={css('pf-c-form__helper-text', { 'pf-m-error': isError })}
    id={`${fieldId}-helper`}
    aria-live="polite"
  >
    {children}
  </div>
);

export default HelperText;
