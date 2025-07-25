import {
  Autocomplete,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CancerTypeOptions, mapCancerToLevel } from '../../Helpers/mapCancerToLevel';
import { CancerTypeData } from '../../Service/getCancerHireachyData';
import { corePalette } from '../../Themes/colours';

interface FilterSelectProps {
  onSearch: (filter: string, value: string | null) => void;
  data: CancerTypeData[];
}

export default function FilterSelect({ onSearch, data }: FilterSelectProps) {
  const [filter, setFilter] = useState('Patient');
  const [searchValue, setSearchValue] = useState('');
  const [comboValue, setComboValue] = useState<{ level: string; cancer: string } | null>(null);
  const [inputText, setInputText] = useState('');
  const [patientIds, setPatientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cancerTypeOptions: CancerTypeOptions[] = mapCancerToLevel(data);

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
    setSearchValue('');
    setComboValue(null);
    setInputText('');
  };

  useEffect(() => {
    setLoading(true);
    fetch('/sample/sample_list')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setPatientIds(data.sample_list);
      })
      .catch((error) => {
        console.error('Error fetching patient IDs: ', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const isValidCancerType = (value: string) => {
    const normalizedTypes = cancerTypeOptions.map((t) => t.cancer.toLowerCase());
    return normalizedTypes.includes(value.toLowerCase());
  };

  const handleSearch = () => {
    const value = filter === 'Cancer Type' ? comboValue?.cancer ?? '' : searchValue;

    switch (filter) {
      case 'Cancer Type':
        if (value && isValidCancerType(value)) {
          onSearch('Cancer Type', value);
        }
        break;
      case 'Patient':
        if (value && value.trim() !== '' && patientIds.includes(value)) {
          onSearch('Patient', value);
          navigate(`/PatientResults?filter=Patient&value=${encodeURIComponent(value)}`);
        }
        break;
      default:
        onSearch(filter, value);
        navigate(`/PatientResults?filter=${encodeURIComponent(filter)}&value=${encodeURIComponent(value)}`);
    }

    setTimeout(() => {
      setSearchValue('');
      setComboValue(null);
      setInputText('');
    }, 0);
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
      <Select
        value={filter}
        onChange={handleChange}
        displayEmpty
        variant="outlined"
        sx={{ minWidth: '150px', height: '40px' }}
        renderValue={(selected) => selected || '+ Add Filter'}
      >
        <MenuItem value="" disabled>
          + Add Filter
        </MenuItem>
        <MenuItem value="Cancer Type">Cancer Type</MenuItem>
        <MenuItem value="Patient">Patient</MenuItem>
      </Select>

      <Autocomplete<string | { cancer: string; level: string }>
        disablePortal
        autoHighlight
        autoSelect
        options={filter === 'Patient' ? patientIds : cancerTypeOptions}
        getOptionLabel={(option) =>
          filter === 'Patient' ? (option as string) : (option as { cancer: string })?.cancer ?? ''
        }
        groupBy={
          filter === 'Cancer Type'
            ? (option) => (option as { cancer: string; level: string })?.level ?? ''
            : undefined
        }
        value={
          filter === 'Cancer Type'
            ? comboValue
            : searchValue !== ''
            ? searchValue
            : null
        }
        inputValue={inputText}
        onInputChange={(event, newInputValue) => {
          setInputText(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (filter === 'Cancer Type') {
            setComboValue((newValue as any) ?? null);
          } else {
            setSearchValue((newValue as string) ?? '');
          }
        }}
        loading={loading}
        popupIcon={null}
        componentsProps={{
          popupIndicator: { sx: { display: 'none' } },
        }}
        filterOptions={(options, state) => {
          const input = state.inputValue.toLowerCase();
          if (filter === 'Patient') {
            return (options as string[]).filter((option) => option.toLowerCase().includes(input));
          }
          return (options as { cancer: string; level: string }[]).filter((option) =>
            option.cancer.toLowerCase().includes(input)
          );
        }}
        noOptionsText="No results"
        sx={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={filter === 'Cancer Type' ? 'Search Cancer Type' : 'Search Patient ID'}
            variant="outlined"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {params.InputProps.endAdornment}
                  <Box
                    sx={{
                      ml: 1,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: corePalette.green150,
                    }}
                    onClick={handleSearch}
                  >
                    <Search size={18} />
                  </Box>
                </Box>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                padding: 0,
                alignItems: 'center',
              },
              '& .MuiInputBase-input': {
                padding: '0 16px',
                lineHeight: '40px',
                height: '40px',
                boxSizing: 'border-box',
              },
              '& .MuiInputLabel-root': {
                top: '-6px',
              },
            }}
          />
        )}
        slotProps={{
          paper: { sx: { textAlign: 'left' } },
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: { offset: [0, 4] },
              },
            ],
          },
        }}
      />
    </Box>
  );
}
