/* eslint-disable no-use-before-define */
import React, { FC, useState, useReducer } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IFilterConfig } from "./IFilterConfig";
import { Chip, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

interface IOwnProps {
  inputPlaceholder: string;
  inputSelectCategoryText: string;
  filtersConfig: Array<IFilterConfig>;
  // filtersConfig: { [key: string]: IFilter };
  // onMenuBlur?: (filters: any) => any;
  // onFilterTypeSelect?: (filters: any) => any;
  // onFilterValueSelect?: (filters: any) => any;
  // onFilterRemove?: (filters: any) => any;
}

interface IAppliedFilter {
  type: string;
  value: string | number | boolean;
  label?: string;
}

const initialState = { count: 0 };

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
  EnterFreeText = "ENTER_FREE_TEXT",
  SelectFilter = "SELECT_FILTER",
  SelectValue = "SELECT_VALUE",
  RemoveFilter = "REMOVE_FILTER",
  SetInputLabel = "SET_INPUT_LABEL",
  ValueChange = "VALUE_CHANGE",
  InputValueChange = "INPUT_VALUE_CHANGE",
  ToggleOpen = "TOGGLE_OPEN",
  ResetFilter = "RESET_FILTER",
}

type ActionPayload = {
  [Types.EnterFreeText]: {
    value: string;
  };
  [Types.SelectFilter]: {
    filterConfig: IFilterConfig | null;
  };
  [Types.SelectValue]: {
    value: string;
  };
  [Types.SetInputLabel]: {
    value: string;
  };
  [Types.ValueChange]: {
    value: string | null;
  };
  [Types.InputValueChange]: {
    value: string;
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
  activeFilerConfig: IFilterConfig | null;
  appliedFilter: Array<any>;
  value: string | null;
  inputValue: string;
  open: boolean;
  forceOpen: boolean | null;
}

function reducer(state: IState, action: FilterActions) {
  switch (action.type) {
    case Types.EnterFreeText:
      return {
        ...state,
        appliedFilter: [
          ...state.appliedFilter,
          { value: action.payload.value },
        ],
        activeFilerConfig: null,
        value: "",
        inputValue: "",
        open: true,
        forceOpen: true,
      };

    case Types.SelectFilter:
      console.log(state);
      return {
        ...state,
        activeFilerConfig: action.payload.filterConfig,
        inputLabel: action.payload.filterConfig
          ? action.payload.filterConfig.label
          : state.inputLabel,
        value: "",
        inputValue: "",
        open: true,
        forceOpen: true,
      };

    case Types.SelectValue:
      return {
        ...state,
        appliedFilter: [
          ...state.appliedFilter,
          // { value: action.payload.value },
          action.payload.value,
        ],
        activeFilerConfig: null,
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
        inputValue: action.payload.value,
      };

    case Types.SetInputLabel:
      return {
        ...state,
        inputLabel: action.payload.value,
      };

    case Types.ToggleOpen:
      console.log(state);

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
        activeFilerConfig: null,
        open: false,
      };

    case Types.RemoveFilter:
      return {
        ...state,
        appliedFilter: state.appliedFilter.filter(
          (f, i) => i !== action.payload.index
        ),
      };
    default:
      return state;
  }
}

const Filter: FC<IOwnProps> = ({
  inputPlaceholder,
  inputSelectCategoryText,
  filtersConfig,
}) => {
  // const [inputLabel, setInputLabel] = useState(inputPlaceholder);
  const [state, dispatch] = useReducer(reducer, {
    inputLabel: inputPlaceholder,
    activeFilerConfig: null,
    appliedFilter: [],
    value: "",
    inputValue: "",
    open: false,
    forceOpen: null,
  });

  const handleInputOpen = () => {
    // setInputLabel(inputSelectCategoryText);
    dispatch({
      type: Types.SetInputLabel,
      payload: { value: inputSelectCategoryText },
    });
  };

  const handleInputClose = () => {
    // setInputLabel(inputPlaceholder);
    dispatch({
      type: Types.SetInputLabel,
      payload: { value: inputPlaceholder },
    });
    dispatch({
      type: Types.ResetFilter,
      payload: {},
    });
  };

  const classes = useStyles();

  return (
    <>
      {state.appliedFilter && (
        <Paper component="ul" className={classes.root}>
          {state.appliedFilter.map((filter, index) => {
            let icon;

            // if (filter.label === "React") {
            //   icon = <TagFacesIcon />;
            // }

            return (
              <li key={filter.key}>
                <Chip
                  // icon={icon}
                  label={filter.value}
                  onDelete={
                    // filter.label === "React" ? undefined : handleDelete(filter)
                    () => {
                      dispatch({
                        type: Types.RemoveFilter,
                        payload: { index },
                      });
                    }
                  }
                  className={classes.chip}
                />
              </li>
            );
          })}
        </Paper>
      )}
      <Autocomplete
        id="filter-category"
        options={
          state.activeFilerConfig
            ? (state.activeFilerConfig.options as any)
            : (filtersConfig as any)
        }
        getOptionLabel={
          state.activeFilerConfig
            ? state.activeFilerConfig.getOptionLabel
            : (filterConfig: any) => filterConfig.label as string
        }
        style={{ width: 300 }}
        openOnFocus
        freeSolo
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
        // value={state.activeFilerConfig ? (state.activeFilerConfig as any) : null}
        value={state.value as any}
        onChange={(event: object, value: any, reason: string) => {
          console.log("onChange filter-category autocomplete");
          console.log(event);
          console.log(value);
          console.log(reason);
          dispatch({ type: Types.ValueChange, payload: { value } });

          switch (reason) {
            case "select-option":
              if (!state.activeFilerConfig) {
                dispatch({
                  type: Types.SelectFilter,
                  payload: { filterConfig: value },
                });
              } else {
                dispatch({
                  type: Types.SelectValue,
                  payload: { value },
                });
                handleInputOpen();
              }

              break;
            case "clear":
              if (!state.activeFilerConfig) {
                dispatch({
                  type: Types.SelectFilter,
                  payload: { filterConfig: null },
                });
              } else {
                dispatch({
                  type: Types.SelectFilter,
                  payload: { filterConfig: null },
                });
                handleInputOpen();
              }

              break;
            case "create-option":
              if (!state.activeFilerConfig) {
                dispatch({ type: Types.EnterFreeText, payload: { value } });
              } else {
                dispatch({
                  type: Types.SelectValue,
                  payload: { value },
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
            payload: { value: newInputValue },
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
    </>
  );
};

export default Filter;
