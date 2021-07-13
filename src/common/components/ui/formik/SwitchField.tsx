import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, Switch } from '@patternfly/react-core';
import { getFieldId } from './utils';
import { SwitchFieldProps } from './types';
import HelperText from './HelperText';

const SwitchField: React.FC<SwitchFieldProps> = ({
  label,
  helperText,
  isRequired,
  onChange,
  getHelperText,
  idPostfix,
  labelIcon,
  ...props
}) => {
  const [field, { touched, error }] = useField(props.name);
  const fieldId = getFieldId(props.name, 'input', idPostfix);
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  const hText = getHelperText ? getHelperText(field.value) : helperText;
  return (
    <FormGroup
      fieldId={fieldId}
      helperText={
        typeof hText === 'string' ? hText : <HelperText fieldId={fieldId}>{hText}</HelperText>
      }
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
      isRequired={isRequired}
      labelIcon={labelIcon}
    >
      <Switch
        {...field}
        id={fieldId}
        label={label}
        isChecked={field.value}
        onChange={(checked, event) => {
          field.onChange(event);
          onChange && onChange(checked, event);
        }}
      />
    </FormGroup>
  );
};

export default SwitchField;
