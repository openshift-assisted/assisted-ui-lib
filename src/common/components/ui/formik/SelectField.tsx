import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, FormSelect, FormSelectOption } from '@patternfly/react-core';
import { getFieldId } from './utils';
import { SelectFieldProps } from './types';
import HelperText from './HelperText';

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
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
      label={label}
      helperText={
        typeof hText === 'string' ? hText : <HelperText fieldId={fieldId}>{hText}</HelperText>
      }
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
      isRequired={isRequired}
      labelIcon={labelIcon}
    >
      <FormSelect
        {...field}
        {...props}
        id={fieldId}
        validated={isValid ? 'default' : 'error'}
        isRequired={isRequired}
        aria-describedby={`${fieldId}-helper`}
        onChange={(value, event) => {
          field.onChange(event);
          onChange && onChange(event);
        }}
      >
        {options.map((option, index) => (
          <FormSelectOption key={option.id || index} {...option} />
        ))}
      </FormSelect>
    </FormGroup>
  );
};

export default SelectField;
