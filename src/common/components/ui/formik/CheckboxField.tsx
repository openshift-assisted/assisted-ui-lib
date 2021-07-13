import * as React from 'react';
import { useField } from 'formik';
import { Checkbox, FormGroup } from '@patternfly/react-core';
import { CheckboxFieldProps } from './types';
import { getFieldId } from './utils';
import HelperText from './HelperText';

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  helperText,
  onChange,
  validate,
  idPostfix,
  ...props
}) => {
  const [field, { touched, error }] = useField({ name: props.name, validate });
  const fieldId = getFieldId(props.name, 'checkbox', idPostfix);
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  return (
    <FormGroup
      fieldId={fieldId}
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
    >
      <Checkbox
        {...field}
        {...props}
        id={fieldId}
        label={label}
        aria-describedby={`${fieldId}-helper`}
        description={
          typeof helperText === 'string' ? (
            helperText
          ) : (
            <HelperText fieldId={fieldId}>{helperText}</HelperText>
          )
        }
        isValid={isValid}
        isChecked={field.value}
        onChange={(value, event) => {
          field.onChange(event);
          onChange && onChange(value, event);
        }}
      />
    </FormGroup>
  );
};

export default CheckboxField;
