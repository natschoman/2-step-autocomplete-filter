/* eslint-disable no-use-before-define */
import React, {
  FC,
  useReducer,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  Ref,
} from "react";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { InputAdornment, TextField } from "@material-ui/core";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { IFilterCategory, IAppliedFilter } from "./IFilterConfig";
import { useStyles } from "./Filter.styles";
import { reducer, IFilterState } from "./reducer";
import { ActionTypes } from "./reducerActions";
import { FilterChip } from "./FilterChip";

const filterOptions = createFilterOptions<any>();

const getLabel = (option: any, state: IFilterState) => {
  let label = "";
  if (option.isFreeSolo) {
    label = option.inputLabel;
    return label;
  }
  if (state.activeFilterCategory) {
    label =
      typeof option === "object" &&
      state.activeFilterCategory &&
      state.activeFilterCategory.getOptionLabel
        ? state.activeFilterCategory.getOptionLabel(option)
        : option.label;
    return label;
  }
  const filterConfig = option;
  if (filterConfig && filterConfig.label) {
    label = filterConfig.label as string;
    return label;
  } else {
    return "";
  }
};

interface IOwnProps {
  /**
   * Placeholder on empty field with no focus.
   */
  inputPlaceholder: string;
  /**
   * Placeholder on focused field with no filter-category selected.
   */
  inputSelectFilterTypeText: string;
  /**
   * Array of filter categories for first step selection.
   */
  filterCategories: Array<IFilterCategory>;
  /**
   * Possibility to enter free text as a filter - its type is then 'TEXT' (default false)
   */
  freeSolo?: boolean;
  /**
   * Text shown if no option with entered value is found. (default 'No options')
   */
  noOptionsText?: string;
  /**
   * Prefix on new option values. (default 'Add')
   */
  addOptionPrefixText?: string;
  /**
   * Text Filter Chip Label. (default 'Text')
   */
  textFilterChipLabel?: string;
  /**
   * Default filters for initial rendering.
   */
  defaultFilters?: Array<IAppliedFilter>;
  /**
   * Callback for changing of filter - passes current filters as parameter.
   */
  onFilterChange?: (filters: Array<IAppliedFilter>) => void;
  /**
   * Ref for setFilters function, ref.setFilters(filters: Array<IAppliedFilter>) => void
   */
  ref?: Ref<FilterRefObject | undefined>;
}

export interface FilterRefObject {
  setFilters: (filters: Array<IAppliedFilter>) => void;
}

export const Filter: FC<IOwnProps> = forwardRef((props, ref) => {
  const classes = useStyles();

  const {
    inputPlaceholder,
    inputSelectFilterTypeText,
    freeSolo = false,
    noOptionsText,
    filterCategories,
    onFilterChange,
    defaultFilters = [],
    addOptionPrefixText = "Add",
    textFilterChipLabel = "Text",
  } = props;

  const [state, dispatch] = useReducer(reducer, {
    inputLabel: inputPlaceholder,
    activeFilterCategory: null,
    appliedFilter:
      defaultFilters && defaultFilters.length ? defaultFilters : [],
    inputValue: "",
    open: false,
    forceOpen: null,
    options: [],
  });

  const rendered = useRef(false);

  // Set the filters from outside via ref.setFilters
  useImperativeHandle(ref, () => ({
    setFilters(newFilter: Array<IAppliedFilter>) {
      dispatch({
        type: ActionTypes.SetFilters,
        payload: { filter: newFilter },
      });
    },
  }));

  // callback for filter-change
  useEffect(() => {
    if (!rendered.current) {
      rendered.current = true;
    } else if (onFilterChange) {
      onFilterChange(state.appliedFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.appliedFilter]);

  // fetch new options on input change
  useEffect(() => {
    async function getOptions() {
      if (
        state.activeFilterCategory &&
        state.activeFilterCategory.fetchOptions
      ) {
        try {
          const result = await state.activeFilterCategory.fetchOptions(
            state.inputValue
          );
          dispatch({
            type: ActionTypes.SetFetchedOptions,
            payload: { options: result },
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (state.activeFilterCategory && state.activeFilterCategory.fetchOptions) {
      getOptions();
    }
  }, [state.activeFilterCategory, state.inputValue]);

  const handleInputOpen = () => {
    dispatch({
      type: ActionTypes.SetInputLabel,
      payload: { inputLabel: inputSelectFilterTypeText },
    });
  };

  const handleInputClose = () => {
    dispatch({
      type: ActionTypes.SetInputLabel,
      payload: { inputLabel: inputPlaceholder },
    });
    dispatch({
      type: ActionTypes.ResetFilterInput,
      payload: {},
    });
  };

  return (
    <div className={classes.root}>
      {state.appliedFilter && (
        <>
          {state.appliedFilter.map((filter: IAppliedFilter, index: number) => {
            const filterCategory = filterCategories.find(
              (fc) => fc.type === filter.type
            );

            return (
              <FilterChip
                key={index}
                filter={filter}
                filterCategory={filterCategory}
                textFilterChipLabel={textFilterChipLabel}
                deleteFilter={() => {
                  dispatch({
                    type: ActionTypes.RemoveFilter,
                    payload: { index },
                  });
                }}
              />
            );
          })}
        </>
      )}
      <Autocomplete
        debug
        selectOnFocus
        // disableClearable
        clearOnBlur
        clearOnEscape
        closeIcon={null}
        popupIcon={null}
        style={{ width: 300 }}
        openOnFocus
        freeSolo={
          state.activeFilterCategory
            ? state.activeFilterCategory.freeSolo || false
            : freeSolo
        }
        noOptionsText={
          state.activeFilterCategory
            ? state.activeFilterCategory.noOptionsText || "No options"
            : noOptionsText || "No options"
        }
        value={null}
        onChange={(_event: object, value: any, reason: string) => {
          switch (reason) {
            case "select-option":
              if (!state.activeFilterCategory) {
                if (value.isFreeSolo) {
                  dispatch({
                    type: ActionTypes.AddFreeTextFilter,
                    payload: { text: value.value },
                  });
                } else {
                  dispatch({
                    type: ActionTypes.SelectFilterCategory,
                    payload: { filterCategory: value },
                  });
                }
              } else {
                dispatch({
                  type: ActionTypes.AddFilter,
                  payload: {
                    appliedFilter: {
                      type: state.activeFilterCategory.type,
                      value: value.value,
                      label: value.label,
                    },
                  },
                });
                handleInputOpen();
              }
              break;

            case "clear":
              dispatch({
                type: ActionTypes.SelectFilterCategory,
                payload: { filterCategory: null },
              });
              if (state.activeFilterCategory) {
                handleInputOpen();
              }
              break;

            case "create-option":
              if (!state.activeFilterCategory) {
                dispatch({
                  type: ActionTypes.AddFreeTextFilter,
                  payload: { text: value },
                });
              } else {
                dispatch({
                  type: ActionTypes.AddFilter,
                  payload: {
                    appliedFilter: {
                      type: state.activeFilterCategory.type,
                      value: value,
                      label: value,
                    },
                  },
                });
                handleInputOpen();
              }
              break;

            default:
              break;
          }
        }}
        inputValue={state.inputValue}
        renderInput={(params) => (
          <TextField
            {...params}
            classes={{
              root: classes.textFieldRoot,
            }}
            variant="outlined"
            onFocus={handleInputOpen}
            onBlur={handleInputClose}
            inputProps={{
              ...params.inputProps,
              "data-testid": "filter-text-input",
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  {state.inputLabel}
                </InputAdornment>
              ),
            }}
          />
        )}
        onInputChange={(_event: object, newInputValue: any) => {
          dispatch({
            type: ActionTypes.InputValueChange,
            payload: { inputValue: newInputValue },
          });
        }}
        open={state.open}
        onOpen={() => {
          dispatch({ type: ActionTypes.ToggleOpen, payload: { open: true } });
        }}
        onClose={() => {
          dispatch({ type: ActionTypes.ToggleOpen, payload: { open: false } });
        }}
        options={
          state.activeFilterCategory ? state.options : (filterCategories as any)
        }
        filterOptions={(options, params) => {
          const filtered = filterOptions(options, params) as any;

          if (
            state.activeFilterCategory
              ? state.activeFilterCategory.freeSolo || false
              : freeSolo
          ) {
            // Suggest the creation of a new value, only if freeSolo is set
            if (params.inputValue !== "") {
              filtered.push({
                isFreeSolo: true,
                inputLabel: `${addOptionPrefixText} "${params.inputValue}"`,
                label: params.inputValue,
                value: params.inputValue,
              });
            }
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          let label = getLabel(option, state);
          return label;
        }}
        renderOption={(option, renderOptionState) => {
          const { inputValue } = renderOptionState;
          if (option.isFreeSolo) return option.inputLabel;

          let label = getLabel(option, state);

          const matches = match(label, inputValue);
          const parts = parse(label, matches);
          return (
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
});
