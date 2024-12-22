import { useCallback, useState, useEffect } from 'react';
import { Autocomplete, TextField, createTheme, ThemeProvider } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3182CE',
    },
    background: {
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            paddingLeft: '2.5rem',
          },
        },
        paper: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
        listbox: {
          padding: 0,
        },
        option: {
          minHeight: 'auto',
          padding: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3182CE',
          },
        },
      },
    },
  },
});

interface AutocompleteInputProps {
  config: {
    title: string;
    icon: any;
    type: any;
    allowSuggestions: boolean;
  };
  value: string;
  onChange: (value: string) => void;
  fetchOptions: (query: string) => Promise<string[]>;
  options: string[];
  onSuggestion?: (value: string) => void;
  loading?: boolean;
  minCharsBeforeSearch?: number;
}

export function AutocompleteInput({
  config,
  value,
  onChange,
  fetchOptions,
  options = [],
  onSuggestion,
  loading = false,
  minCharsBeforeSearch = 2,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const Icon = config.icon;

  const handleSearch = useCallback(async (query: string) => {
    if (query.length >= minCharsBeforeSearch && fetchOptions) {
      setShowAddOption(false); // Reset the add option visibility
      setIsSearching(true);
      try {
        await fetchOptions(query);
        // After fetching, wait a brief moment before showing the add option
        setTimeout(() => setShowAddOption(true), 500);
      } finally {
        setIsSearching(false);
      }
    }
  }, [fetchOptions, minCharsBeforeSearch]);

  const debouncedSearch = useDebounce(handleSearch, 300);

  // Reset showAddOption when input is cleared
  useEffect(() => {
    if (!inputValue) {
      setShowAddOption(false);
    }
  }, [inputValue]);

  const handleChange = (_: any, newValue: string | null) => {
    if (newValue === '__add_new__') {
      handleSuggestionClick();
    } else if (newValue && Array.isArray(options) && options.includes(newValue)) {
      onChange(newValue);
      setInputValue('');
      setOpen(false);
      setShowAddOption(false);
    } else {
      onChange('');
    }
  };

  const handleInputChange = (_: any, newInputValue: string) => {
    setInputValue(newInputValue);
    if (!newInputValue) {
      setOpen(false);
      setShowAddOption(false);
    } else {
      debouncedSearch(newInputValue);
    }
  };

  const handleSuggestionClick = () => {
    if (inputValue && onSuggestion) {
      onSuggestion(inputValue);
      setInputValue('');
      setOpen(false);
      setShowAddOption(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative">
        <Autocomplete
          value={value}
          inputValue={inputValue}
          onChange={handleChange}
          onInputChange={handleInputChange}
          options={[
            ...(Array.isArray(options) ? options : []),
            ...(inputValue && config.allowSuggestions && showAddOption && !options.includes(inputValue) ? ['__add_new__'] : [])
          ]}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          fullWidth
          blurOnSelect
          selectOnFocus
          clearOnBlur={!config.allowSuggestions}
          handleHomeEndKeys
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                  {config.title}
                </div>
              }
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <div className="flex items-center gap-2">
                    {(isSearching || loading) && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                    {params.InputProps.endAdornment}
                  </div>
                ),
              }}
            />
          )}
          loading={isSearching || loading}
          loadingText="Loading..."
          noOptionsText={isSearching ? "Searching..." : "No options"}
          renderOption={(props, option) => {
            // Remove key from props to avoid the spread warning
            const { key, ...otherProps } = props;

            if (option === '__add_new__') {
              return (
                <div
                  {...otherProps}
                  key={key}
                  className="p-2 transition-all duration-200"
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionClick();
                    }}
                    className="rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-700">Add "{inputValue}"</span>
                        <span className="text-sm text-blue-600">Click to add to database</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div {...otherProps} key={key} className="px-4 py-2 hover:bg-gray-100">
                {option}
              </div>
            );
          }}
          filterOptions={(x) => x}
        />
      </div>
    </ThemeProvider>
  );
}
