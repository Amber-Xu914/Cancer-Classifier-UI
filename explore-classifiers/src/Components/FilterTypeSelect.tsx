import { Select, SelectChangeEvent, MenuItem } from '@mui/material';

interface FilterTypeSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export const FilterTypeSelect = ({ value, onChange }: FilterTypeSelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value);
    };

    return (
        <Select
            value={value}
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
    );
};