/* eslint-disable no-use-before-define */
import React, { FC, useReducer, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IFilterCategory, IAppliedFilter } from "./IFilterConfig";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

interface IOwnProps {
  /**
   * Placeholder on empty field with no focus.
   */
  inputPlaceholder: string;
  /**
   * Placeholder on focused field with no filter-category selected.
   */
  inputSelectFilterTypeText: string;
  filterCategories: Array<IFilterCategory>;
  /**
   * Possibility to enter free text as a filter - its type is then 'TEXT'
   */
  freeSolo?: boolean;
  /**
   * Text shown if no option with entered value is found.
   */
  noOptionsText?: string;

  // filterCategories: { [key: string]: IFilter };
  // onMenuBlur?: (filters: any) => any;
  // onFilterTypeSelect?: (filters: any) => any;
  // onFilterValueSelect?: (filters: any) => any;
  // onFilterRemove?: (filters: any) => any;
  onFilterChange?: (filters: Array<IAppliedFilter>) => any;
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  AddFreeTextFilter = "ADD_FREE_TEXT_FILTER",
  SelectFilterCategory = "SELECT_FILTER_CATEGORY",
  AddFilter = "ADD_FILTER",
  RemoveFilter = "REMOVE_FILTER",

  ValueChange = "VALUE_CHANGE",
  InputValueChange = "INPUT_VALUE_CHANGE",
  SetInputLabel = "SET_INPUT_LABEL",
  ToggleOpen = "TOGGLE_OPEN",
  ResetFilter = "RESET_FILTER",
}

type ActionPayload = {
  [Types.AddFreeTextFilter]: {
    text: string;
  };
  [Types.SelectFilterCategory]: {
    filterCategory: IFilterCategory | null;
  };
  [Types.AddFilter]: {
    appliedFilter: IAppliedFilter;
  };
  [Types.ValueChange]: {
    value: string | null;
  };
  [Types.InputValueChange]: {
    inputValue: string;
  };
  [Types.SetInputLabel]: {
    inputLabel: string;
  };
  [Types.ToggleOpen]: {
    open: boolean;
  };
  [Types.ResetFilter]: {};
  [Types.RemoveFilter]: {
    index: number;
  };
};

export type FilterActions = ActionMap<ActionPayload>[keyof ActionMap<
  ActionPayload
>];

interface IState {
  inputLabel: string;
  activeFilterCategory: IFilterCategory | null;
  appliedFilter: Array<IAppliedFilter>;
  value: string | null;
  inputValue: string;
  open: boolean;
  forceOpen: boolean | null;
}

function reducer(state: IState, action: FilterActions) {
  switch (action.type) {
    case Types.AddFreeTextFilter:
      return {
        ...state,
        appliedFilter: [
          ...state.appliedFilter,
          {
            type: "TEXT",
            label: action.payload.text,
            value: action.payload.text,
          },
        ],
        activeFilterCategory: null,
        value: "",
        inputValue: "",
        open: true,
        forceOpen: true,
      };

    case Types.SelectFilterCategory:
      return {
        ...state,
        activeFilterCategory: action.payload.filterCategory,
        inputLabel: action.payload.filterCategory
          ? action.payload.filterCategory.label
          : state.inputLabel,
        value: "",
        inputValue: "",
        open: true,
        forceOpen: true,
      };

    case Types.AddFilter:
      return {
        ...state,
        appliedFilter: [
          ...state.appliedFilter,
          { ...action.payload.appliedFilter },
        ],
        activeFilterCategory: null,
        value: "",
        inputValue: "",
        open: true,
        forceOpen: true,
      };

    case Types.ValueChange:
      return {
        ...state,
        value: action.payload.value,
      };

    case Types.InputValueChange:
      return {
        ...state,
        inputValue: action.payload.inputValue,
      };

    case Types.SetInputLabel:
      return {
        ...state,
        inputLabel: action.payload.inputLabel,
      };

    case Types.ToggleOpen:
      if (state.forceOpen) {
        return {
          ...state,
          forceOpen: null,
        };
      }
      return {
        ...state,
        open: action.payload.open,
      };

    case Types.ResetFilter:
      return {
        ...state,
        value: "",
        inputValue: "",
        activeFilterCategory: null,
        open: false,
      };

    case Types.RemoveFilter:
      return {
        ...state,
        appliedFilter: state.appliedFilter.filter(
          (_f, i) => i !== action.payload.index
        ),
      };
    default:
      return state;
  }
}

const Filter: FC<IOwnProps> = ({
  inputPlaceholder,
  inputSelectFilterTypeText,
  freeSolo = false,
  noOptionsText,
  filterCategories,
  onFilterChange,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    inputLabel: inputPlaceholder,
    activeFilterCategory: null,
    appliedFilter: [],
    value: "",
    inputValue: "",
    open: false,
    forceOpen: null,
  });

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(state.appliedFilter);
    }
  }, [onFilterChange, state.appliedFilter]);

  const handleInputOpen = () => {
    dispatch({
      type: Types.SetInputLabel,
      payload: { inputLabel: inputSelectFilterTypeText },
    });
  };

  const handleInputClose = () => {
    dispatch({
      type: Types.SetInputLabel,
      payload: { inputLabel: inputPlaceholder },
    });
    dispatch({
      type: Types.ResetFilter,
      payload: {},
    });
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {state.appliedFilter && (
        <>
          {state.appliedFilter.map((filter: IAppliedFilter, index: number) => {
            const filterCategory = filterCategories.find(
              (fc) => fc.type === filter.type
            );

            return (
              <Chip
                key={index}
                variant="outlined"
                label={
                  filter.type === "TEXT" ? (
                    <>
                      Text: <strong>{filter.value}</strong>
                    </>
                  ) : (
                    <>
                      {filterCategory && filterCategory.getChipLabel
                        ? filterCategory.getChipLabel(filter)
                        : filter.type}
                      :{" "}
                      <strong>
                        {filterCategory && filterCategory.getChipValue
                          ? filterCategory.getChipValue(filter)
                          : filter.label || filter.value}
                      </strong>
                    </>
                  )
                }
                onDelete={() => {
                  dispatch({
                    type: Types.RemoveFilter,
                    payload: { index },
                  });
                }}
                className={classes.chip}
              />
            );
          })}
        </>
      )}
      <Autocomplete
        id="filter-category"
        options={
          state.activeFilterCategory
            ? (state.activeFilterCategory.options as any)
            : (filterCategories as any)
        }
        getOptionLabel={
          state.activeFilterCategory
            ? (option) => {
                return typeof option === "object" &&
                  state.activeFilterCategory &&
                  state.activeFilterCategory.getOptionLabel
                  ? state.activeFilterCategory.getOptionLabel(option)
                  : option.label;
              }
            : (filterConfig: any) => filterConfig.label as string
        }
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
        renderInput={(params) => (
          <TextField
            id="filter-category-input"
            {...params}
            label={state.inputLabel}
            variant="outlined"
            onFocus={handleInputOpen}
            onBlur={handleInputClose}
          />
        )}
        value={state.value as any}
        onChange={(event: object, value: any, reason: string) => {
          console.log("onChange filter-category autocomplete");
          console.log(event);
          console.log(value);
          console.log(reason);
          dispatch({ type: Types.ValueChange, payload: { value } });

          switch (reason) {
            case "select-option":
              if (!state.activeFilterCategory) {
                dispatch({
                  type: Types.SelectFilterCategory,
                  payload: { filterCategory: value },
                });
              } else {
                dispatch({
                  type: Types.AddFilter,
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
              if (!state.activeFilterCategory) {
                dispatch({
                  type: Types.SelectFilterCategory,
                  payload: { filterCategory: null },
                });
              } else {
                dispatch({
                  type: Types.SelectFilterCategory,
                  payload: { filterCategory: null },
                });
                handleInputOpen();
              }

              break;
            case "create-option":
              if (!state.activeFilterCategory) {
                dispatch({
                  type: Types.AddFreeTextFilter,
                  payload: { text: value },
                });
              } else {
                console.log("##########");

                dispatch({
                  type: Types.AddFilter,
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
          }
        }}
        inputValue={state.inputValue}
        onInputChange={(event: object, newInputValue: any) => {
          // console.log("onInputChange filter-category autocomplete");
          // console.log(event);
          // console.log(newInputValue);
          dispatch({
            type: Types.InputValueChange,
            payload: { inputValue: newInputValue },
          });
        }}
        open={state.open}
        onOpen={() => {
          console.log("onOpen");
          dispatch({ type: Types.ToggleOpen, payload: { open: true } });
        }}
        onClose={() => {
          console.log("onClose");
          dispatch({ type: Types.ToggleOpen, payload: { open: false } });
        }}
      />
    </div>
  );
};

export default Filter;
