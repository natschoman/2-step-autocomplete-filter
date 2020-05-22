import { IOption, IFilterCategory, IAppliedFilter } from "./IFilterConfig";

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

export enum ActionTypes {
  AddFreeTextFilter = "ADD_FREE_TEXT_FILTER",
  SelectFilterCategory = "SELECT_FILTER_CATEGORY",
  AddFilter = "ADD_FILTER",
  RemoveFilter = "REMOVE_FILTER",
  InputValueChange = "INPUT_VALUE_CHANGE",
  SetInputLabel = "SET_INPUT_LABEL",
  ToggleOpen = "TOGGLE_OPEN",
  ResetFilterInput = "RESET_FILTER_INPUT",
  SetFilters = "SET_FILTER",
  SetFetchedOptions = "SET_FETCHED_OPTIONS",
}

type ActionPayload = {
  [ActionTypes.AddFreeTextFilter]: {
    text: string;
  };
  [ActionTypes.SelectFilterCategory]: {
    filterCategory: IFilterCategory | null;
  };
  [ActionTypes.AddFilter]: {
    appliedFilter: IAppliedFilter;
  };
  [ActionTypes.InputValueChange]: {
    inputValue: string;
  };
  [ActionTypes.SetInputLabel]: {
    inputLabel: string;
  };
  [ActionTypes.ToggleOpen]: {
    open: boolean;
  };
  [ActionTypes.ResetFilterInput]: {};
  [ActionTypes.RemoveFilter]: {
    index: number;
  };
  [ActionTypes.SetFilters]: {
    filter: Array<IAppliedFilter>;
  };
  [ActionTypes.SetFetchedOptions]: {
    options: Array<IOption>;
  };
};

export type FilterActions = ActionMap<ActionPayload>[keyof ActionMap<
  ActionPayload
>];