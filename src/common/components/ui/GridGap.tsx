import React from 'react';

/**
 * This component allows to maintain grid gap behaviour of PF Form by wrapping
 * FormGroup components which are inside of Grid
 */
const GridGap: React.FC = (props) => <div {...props} className="pf-c-form" />;

export default GridGap;
