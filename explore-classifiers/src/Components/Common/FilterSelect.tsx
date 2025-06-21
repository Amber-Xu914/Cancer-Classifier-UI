import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Button,
} from '@mui/material';
import { useState } from 'react';
import zccTheme from '../../Themes/zccTheme';

export default function FilterSelect() {
  const [filter, setFilter] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchValue, 'with filter:', filter);
    // TODO: Add search logic here
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        my: 2,
      }}
    >
      {/* Dropdown Filter */}
      <Select
        value={filter}
        onChange={handleChange}
        displayEmpty
        variant="outlined"
        sx={{
          backgroundColor: zccTheme.colours.core.yellow150,
          color: zccTheme.colours.core.offBlack100,
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          minWidth: '150px',
          height: '40px',
          '& .MuiSelect-icon': {
            color: zccTheme.colours.core.offBlack100,
          },
          '&:hover': {
            backgroundColor: zccTheme.colours.core.yellow100,
          },
        }}
        renderValue={(selected) => selected || '+ Add Filter'}
      >
        <MenuItem value="" disabled>
          + Add Filter
        </MenuItem>
        <MenuItem value="Classification">Classification</MenuItem>
        <MenuItem value="Patient">Patient</MenuItem>
      </Select>

      {/* Search Input */}
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search"
        style={{
          height: '40px',
          borderRadius: '30px',
          border: `1px solid ${zccTheme.colours.core.grey100}`,
          padding: '0 16px',
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          fontSize: '0.875rem',
        }}
      />

      {/* Search Button */}
      <Button
        variant="bold"
        onClick={handleSearch}
        sx={{
          backgroundColor: zccTheme.colours.core.yellow150,
          color: zccTheme.colours.core.offBlack100,
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          height: '40px',
          padding: '0 24px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: zccTheme.colours.core.yellow100,
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
}
