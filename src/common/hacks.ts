import React from 'react';
import { getAssistedUiLibVersion } from './config';

// TODO(jtomasek): Stop using this once https://github.com/developit/microbundle/issues/564#issuecomment-593146626
// is fixed, use `microbundle --jsxFragment React.Fragment` instead.
// Workaround for TS17016
window['Fragment'] = React.Fragment;

console.info('Assisted-ui-lib version: ', getAssistedUiLibVersion());
