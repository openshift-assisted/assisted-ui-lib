import React from 'react';
import { shallowEqual } from 'react-redux';
import _ from 'lodash';
import { useFormikContext } from 'formik';

const FormikAutoSave: React.FC<{ debounce?: number }> = ({ debounce = 1000 }) => {
  const { values, dirty, isSubmitting, submitForm } = useFormikContext();
  const prevValuesRef = React.useRef(values);
  const commitRef = React.useRef(_.debounce(submitForm, debounce));

  React.useEffect(() => {
    if (!shallowEqual(prevValuesRef.current, values) && dirty && !isSubmitting) {
      commitRef.current();
    }
    if (!isSubmitting) {
      prevValuesRef.current = values;
    }
  }, [values, dirty, isSubmitting]);

  React.useEffect(() => {
    const commit = commitRef.current;
    return () => commit.cancel();
  }, []);

  return null;
};

export default FormikAutoSave;
