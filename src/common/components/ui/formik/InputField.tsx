import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, Split, SplitItem, TextInput } from '@patternfly/react-core';
import { InputFieldProps } from './types';
import { getFieldId } from './utils';
import HelperText from './HelperText';

const InputField: React.FC<InputFieldProps> = React.forwardRef(
  (
    {
      label,
      labelIcon,
      helperText,
      isRequired,
      onChange,
      validate,
      idPostfix,
      children,
      noDefaultOnChange,
      ...props
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const [field, { touched, error }] = useField({ name: props.name, validate });
    const fieldId = getFieldId(props.name, 'input', idPostfix);
    const isValid = !(touched && error);
    const errorMessage = !isValid ? error : '';
    return (
      <FormGroup
        fieldId={fieldId}
        label={label}
        helperText={
          typeof helperText === 'string' ? (
            helperText
          ) : (
            <HelperText fieldId={fieldId}>{helperText}</HelperText>
          )
        }
        helperTextInvalid={errorMessage}
        validated={isValid ? 'default' : 'error'}
        isRequired={isRequired}
        labelIcon={labelIcon}
      >
        <Split>
          <SplitItem isFilled>
            <TextInput
              {...field}
              {...props}
              ref={ref}
              id={fieldId}
              validated={isValid ? 'default' : 'error'}
              isRequired={isRequired}
              aria-describedby={`${fieldId}-helper`}
              onChange={(value, event) => {
                !noDefaultOnChange && field.onChange(event);
                onChange && onChange(event);
              }}
            />
          </SplitItem>
          <SplitItem>{children}</SplitItem>
        </Split>
      </FormGroup>
    );
  },
);

export default InputField;
