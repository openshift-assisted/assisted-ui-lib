import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, TextContent, Text } from '@patternfly/react-core';
import { getFieldId, HelperText } from './formik';

export interface StaticFieldProps {
  name: string;
  label: string;
  helperText?: React.ReactNode;
  helperTextInvalid?: React.ReactNode;
  isRequired?: boolean;
  isValid?: boolean;
}

export const StaticField: React.FC<StaticFieldProps> = ({
  label,
  name,
  children,
  helperText,
  helperTextInvalid,
  isRequired,
  isValid = true,
}) => {
  const fieldId = getFieldId(name, 'static');

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
      helperTextInvalid={helperTextInvalid}
      validated={isValid ? 'default' : 'error'}
      isRequired={isRequired}
    >
      {children}
    </FormGroup>
  );
};

/**
 * Static Formik field which sets value prop as formik field value
 */
type FormikStaticFieldProps = {
  value: string;
} & StaticFieldProps;

export const FormikStaticField: React.FC<FormikStaticFieldProps> = ({ value, ...props }) => {
  const [, , helpers] = useField({ name: props.name });

  React.useEffect(() => {
    helpers.setValue(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <StaticField {...props} />;
};

/**
 * Simplified form component for rendering static text.
 * Does not reflect field value from formik.
 */
export const StaticTextField: React.FC<StaticFieldProps> = ({ children, ...props }) => {
  const fieldId = getFieldId(props.name, 'static');

  return (
    <StaticField {...props}>
      <TextContent>
        <Text component="p" id={fieldId} aria-describedby={`${fieldId}-helper`}>
          {children}
        </Text>
      </TextContent>
    </StaticField>
  );
};
