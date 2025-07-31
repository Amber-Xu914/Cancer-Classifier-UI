import {
    Box
} from '@mui/material';
import {
    forwardRef,
    useImperativeHandle,
    useState
} from 'react';
import {
    mapCancerToLevel
} from '../../Helpers/mapCancerToLevel';
import { CancerTypeData } from '../../Service/getCancerHireachyData';
import { FilterTypeSelect } from './FilterTypeSelect';
import { SearchAutocomplete } from './SearchAutocomplete';
import { useSampleIds, useSearchLogic } from '../../Hooks';

export interface FilterSelectHandles {
    clearInputs: () => void;
}

interface FilterSelectProps {
    onSearch: (filter: string, value: string | null) => void;
    data: CancerTypeData[];
}

const FilterSelect = forwardRef<FilterSelectHandles, FilterSelectProps>(
    ({ onSearch, data }, ref) => {
        const [filter, setFilter] = useState('Patient');
        const [searchValue, setSearchValue] = useState('');
        const [comboValue, setComboValue] = useState<{
            level: string;
            cancer: string;
        } | null>(null);
        const [inputText, setInputText] = useState('');

        const { patientIds, loading } = useSampleIds();
        const cancerTypeOptions = mapCancerToLevel(data);
        const { handleSearch } = useSearchLogic({ onSearch, cancerTypeOptions, patientIds });

        useImperativeHandle(ref, () => ({
            clearInputs: () => {
                setSearchValue('');
                setComboValue(null);
                setInputText('');
            },
        }));

        const handleFilterChange = (newFilter: string) => {
            setFilter(newFilter);
            setSearchValue('');
            setComboValue(null);
            setInputText('');
        };

        const handleSearchClick = () => {
            handleSearch(filter, searchValue, comboValue);

            // Clear inputs after search
            setTimeout(() => {
                setSearchValue('');
                setComboValue(null);
                setInputText('');
            }, 0);
        };

        const handleValueChange = (newValue: any) => {
            if (filter === 'Cancer Type') {
                setComboValue(newValue ?? null);
            } else {
                setSearchValue((newValue as string) ?? '');
            }
        };

        const getCurrentValue = () => {
            if (filter === 'Cancer Type') {
                return comboValue;
            }
            return searchValue !== '' ? searchValue : null;
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
                <FilterTypeSelect
                    value={filter}
                    onChange={handleFilterChange}
                />

                <SearchAutocomplete
                    filter={filter}
                    patientIds={patientIds}
                    cancerTypeOptions={cancerTypeOptions}
                    loading={loading}
                    inputText={inputText}
                    onInputChange={setInputText}
                    onValueChange={handleValueChange}
                    onSearch={handleSearchClick}
                    value={getCurrentValue()}
                />
            </Box>
        );
    }
);

export default FilterSelect;