import { Autocomplete, TextField, Box } from '@mui/material';
import { Search } from 'lucide-react';
import { CancerTypeOptions } from '../Helpers/mapCancerToLevel';
import { corePalette } from '../Themes/colours';

interface SearchAutocompleteProps {
    filter: string;
    patientIds: string[];
    cancerTypeOptions: CancerTypeOptions[];
    loading: boolean;
    inputText: string;
    onInputChange: (value: string) => void;
    onValueChange: (value: any) => void;
    onSearch: () => void;
    value: any;
}

export const SearchAutocomplete = ({
    filter,
    patientIds,
    cancerTypeOptions,
    loading,
    inputText,
    onInputChange,
    onValueChange,
    onSearch,
    value,
}: SearchAutocompleteProps) => {
    const options = filter === 'Patient' ? patientIds : cancerTypeOptions;

    const getOptionLabel = (option: any) => {
        return filter === 'Patient'
            ? (option as string)
            : (option as { cancer: string })?.cancer ?? '';
    };

    const groupBy = filter === 'Cancer Type'
        ? (option: any) => (option as { cancer: string; level: string })?.level ?? ''
        : undefined;

    const filterOptions = (options: any[], state: any) => {
        const input = state.inputValue.toLowerCase();
        if (filter === 'Patient') {
            return (options as string[]).filter((option) =>
                option.toLowerCase().includes(input)
            );
        }
        return (options as { cancer: string; level: string }[]).filter(
            (option) => option.cancer.toLowerCase().includes(input)
        );
    };

    return (
        <Autocomplete
            disablePortal
            autoHighlight
            autoSelect
            options={options}
            getOptionLabel={getOptionLabel}
            groupBy={groupBy}
            value={value}
            inputValue={inputText}
            onInputChange={(event, newInputValue) => {
                onInputChange(newInputValue);
            }}
            onChange={(event, newValue) => {
                onValueChange(newValue);
            }}
            loading={loading}
            popupIcon={null}
            componentsProps={{
                popupIndicator: { sx: { display: 'none' } },
            }}
            filterOptions={filterOptions}
            noOptionsText="No results"
            sx={{ width: 500 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={
                        filter === 'Cancer Type'
                            ? 'Search Cancer Type'
                            : 'Search Patient ID'
                    }
                    variant="outlined"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSearch();
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
                                    onClick={onSearch}
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
    );
};