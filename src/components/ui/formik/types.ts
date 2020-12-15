import { TextInputTypes, FormSelectOptionProps } from '@patternfly/react-core';
import { FieldValidator, FieldHelperProps } from 'formik';
import { DropzoneProps, DropFileEventHandler } from 'react-dropzone';

export interface FieldProps {
  name: string;
  label?: string;
  labelIcon?: React.ReactElement;
  helperText?: React.ReactNode;
  isRequired?: boolean;
  style?: React.CSSProperties;
  isReadOnly?: boolean;
  disableDeleteRow?: boolean;
  disableAddRow?: boolean;
  className?: string;
  groupClassName?: string;
  isDisabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any>;
  validate?: FieldValidator;
  min?: number;
  max?: number;
  idPostfix?: string;
}

export interface SelectFieldProps extends FieldProps {
  options: FormSelectOptionProps[];
  onChange?: (event: React.FormEvent<HTMLSelectElement>) => void;
  getHelperText?: (value: string) => React.ReactNode | undefined;
  // onBlur?: (event: React.FormEvent<HTMLSelectElement>) => void;
}

export interface SwitchFieldProps extends FieldProps {
  onChange?: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void;
  getHelperText?: (value: string) => string | undefined;
}

export interface InputFieldProps extends FieldProps {
  type?: TextInputTypes;
  placeholder?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  validate?: FieldValidator;
}

export interface TextAreaFieldProps extends FieldProps {
  getErrorText?: (error: string) => React.ReactNode | undefined;
  placeholder?: string;
  onChange?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export interface UploadFieldProps extends FieldProps {
  getErrorText?: (error: string) => React.ReactNode | undefined;
  placeholder?: string;
  onChange?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FormEvent<HTMLDivElement>) => void;
}

export interface UploadFieldProps extends FieldProps {
  getErrorText?: (error: string) => React.ReactNode | undefined;
  placeholder?: string;
  onChange?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  allowEdittingUploadedText?: boolean;
  dropzoneProps?: Omit<DropzoneProps, 'onDropRejected'> & {
    onDropRejected?: (helpers: FieldHelperProps<string>) => DropFileEventHandler;
  };
}

export interface TextAreaSecretProps extends TextAreaFieldProps {
  isSet?: boolean;
  isEdit: boolean;
  helperTextHidden?: string;
  onToggle: (isHidden: boolean) => void;
}

export interface CheckboxFieldProps extends FieldProps {
  onChange?: (value: boolean, event: React.FormEvent<HTMLInputElement>) => void;
}

export interface SearchInputFieldProps extends InputFieldProps {
  onSearch: (searchTerm: string) => void;
}

export interface DropdownFieldProps extends FieldProps {
  items?: object;
  selectedKey?: string;
  title?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}
