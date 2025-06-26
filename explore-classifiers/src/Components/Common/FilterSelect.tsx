import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useState } from 'react';
import { Search } from 'lucide-react';
import CustomButton from './Button';
import zccTheme from '../../Themes/zccTheme';

interface FilterSelectProps {
  onSearch: (filter: string, value: string | null) => void;
}

export default function FilterSelect({ onSearch }: FilterSelectProps) {
  const [filter, setFilter] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [comboValue, setComboValue] = useState<string | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
    setSearchValue('');
    setComboValue(null);
  };

  const handleSearch = () => {
    const value = filter === 'Cancer Type' ? comboValue : searchValue;
    onSearch(filter, value); // on click
  };

  // TODO: fetching the available cancer types from API
  const cancerTypeOptions = [
            "Central Nervous System (CNS)", "Bone & Soft Tissue",
            "Medulloblastoma",
            "ATRT", "Ependymoma", "DIPG",
            "Ewing Sarcoma"
          ]

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
          backgroundColor: zccTheme.colours.core.yellow100,
          color: zccTheme.colours.core.offBlack100,
          borderRadius: '30px',
          fontSize: '0.75rem',
          minWidth: '150px',
          height: '40px',
          '& .MuiSelect-icon': {
            color: zccTheme.colours.core.offBlack100,
          },
          '&:hover': {
            backgroundColor: zccTheme.colours.core.yellow150,
          },
        }}
        renderValue={(selected) => selected || '+ Add Filter'}
      >
        <MenuItem value="" disabled>
          + Add Filter
        </MenuItem>
        <MenuItem value="Cancer Type">Cancer Type</MenuItem>
        <MenuItem value="Patient">Patient</MenuItem>
      </Select>

      {/* Search Input or ComboBox */}
      {filter === 'Cancer Type' ? (
        <Autocomplete
          disablePortal
          options={cancerTypeOptions}
          value={comboValue}
          onChange={(event, newValue) => setComboValue(newValue)}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Cancer Type"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  height: '40px',
                  padding: 0,
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  alignItems: 'center',
                },
                '& .MuiInputBase-input': {
                  padding: '0 16px',
                  lineHeight: '40px',
                  height: '40px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiInputLabel-root': {
                  top: '-6px',
                },
              }}
            />
          )}
          slotProps={{
            paper: {
              sx: {
                textAlign: 'left',
              },
            },
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4],
                  },
                },
              ],
            },
          }}
        />
      ) : (
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
            fontSize: '0.75rem',
            width: '300px',
          }}
        />
      )}

      {/* Search Button */}
      <CustomButton
        label=""
        variant="bold"
        onClick={handleSearch}
        startIcon={<Search size={16} />}
        sx={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          padding: 0,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </Box>
  );
}
