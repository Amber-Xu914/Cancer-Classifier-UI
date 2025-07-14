import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Autocomplete,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import CustomButton from './Button';
import zccTheme from '../../Themes/zccTheme';
import { cancerTypeOptions } from '../../Constants/Common/cancerTypes';

interface FilterSelectProps {
    onSearch: (filter: string, value: string | null) => void;
}

export default function FilterSelect({ onSearch }: FilterSelectProps) {
    const [filter, setFilter] = useState('Patient');
    const [searchValue, setSearchValue] = useState('');
    const [comboValue, setComboValue] = useState<{ level: string, cancer: string } | null>(null);
    const [patientIds, setPatientIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
        setSearchValue('');
        setComboValue(null);
    };

    useEffect(() => {
        setLoading(true);
        fetch('/sample/sample_list')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPatientIds(data.sample_list);
            })
            .catch((error) => {
                console.error('Error fetching patient IDs: ', error);
            })
            .finally(() => { setLoading(false) });
    }, []);

    const isValidCancerType = (value: string) => {
        const normalizedTypes = cancerTypeOptions.map(t => t.cancer.toLowerCase());
        return normalizedTypes.includes(value.toLowerCase());
    }

    const handleSearch = () => {
        const value = filter === 'Cancer Type' ? comboValue?.cancer ?? '' : searchValue;

        switch (filter) {
            case 'Cancer Type':
                if (value && isValidCancerType(value)) {
                    onSearch('Cancer Type', value);
                }
                break;
            case 'Patient':
                if (value && value.trim() !== ''
                    && patientIds.includes(value)
                ) {
                    onSearch('Patient', value);
                }
                break;
            default:
                onSearch(filter, value);
        }
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
                    minWidth: '150px',
                    height: '40px',
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
            {
                <Autocomplete<string | { cancer: string; level: string }>
                    disablePortal

                    options={filter === 'Patient' ? patientIds : cancerTypeOptions}
                    getOptionLabel={(option) =>
                        filter === 'Patient'
                            ? option as string
                            : (option as { cancer: string })?.cancer ?? ''
                    }
                    groupBy={filter === 'Cancer Type'
                        ? (option) => (option as { cancer: string, level: string })?.level ?? ''
                        : undefined
                    }
                    value={filter === 'Cancer Type' ? comboValue ?? null : null}
                    onChange={(event, newValue) => {
                        if (filter === 'Cancer Type') {
                            setComboValue((newValue as any) ?? null);
                        } else {
                            setSearchValue(newValue as string ?? '')
                        }
                    }}
                    loading={loading}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={filter === 'Cancer Type' ? "Search Cancer Type" : 'Search Patient ID'}
                            variant="outlined"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
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
            }
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
