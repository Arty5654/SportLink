import * as React from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//Code from https://mui.com/material-ui/react-toggle-button/

export default function ToggleButtons({ alignment, setAlignment }) {

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    console.log(newAlignment)
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      size="large"
    >
      <ToggleButton value="Teams" aria-label="left aligned">
        Teams
      </ToggleButton>
      <ToggleButton value="Events" aria-label="right aligned">
        Matches
      </ToggleButton>
    </ToggleButtonGroup>
  );
}