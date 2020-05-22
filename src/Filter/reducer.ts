import { FilterActions, ActionTypes } from "./reducerActions";
import { IFilterCategory, IAppliedFilter, IOption } from "./IFilterConfig";

export interface IFilterState {
  inputLabel: string;
  activeFilterCategory: IFilterCategory | null;
  appliedFilter: Array<IAppliedFilter>;
  inputValue: string;
  open: boolean;
  forceOpen: boolean | null;
  options: Array<IOption> | null;
}

export function reducer(state: IFilterState, action: FilterActions) {
  switch (action.type) {
    case ActionTypes.AddFreeTextFilter:
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
        inputValue: "",
        open: true,
        forceOpen: true,
        options: [],
      };

    case ActionTypes.SelectFilterCategory:
      return {
        ...state,
        activeFilterCategory: action.payload.filterCategory,
        inputLabel: action.payload.filterCategory
          ? `${action.payload.filterCategory.label}:`
          : state.inputLabel,
        inputValue: "",
        open: true,
        forceOpen: true,
        options:
          action.payload.filterCategory &&
          action.payload.filterCategory.options &&
          action.payload.filterCategory.options.length
            ? action.payload.filterCategory.options
            : [],
      };

    case ActionTypes.AddFilter:
      return {
        ...state,
        appliedFilter: [
          ...state.appliedFilter,
          { ...action.payload.appliedFilter },
        ],
        activeFilterCategory: null,
        inputValue: "",
        open: true,
        forceOpen: true,
        options: [],
      };

    case ActionTypes.InputValueChange:
      return {
        ...state,
        inputValue: action.payload.inputValue,
      };

    case ActionTypes.SetInputLabel:
      return {
        ...state,
        inputLabel: action.payload.inputLabel,
      };

    case ActionTypes.ToggleOpen:
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

    case ActionTypes.ResetFilterInput:
      return {
        ...state,
        inputValue: "",
        activeFilterCategory: null,
        open: false,
        options: [],
      };

    case ActionTypes.RemoveFilter:
      return {
        ...state,
        appliedFilter: state.appliedFilter.filter(
          (_f, i) => i !== action.payload.index
        ),
      };

    case ActionTypes.SetFilters:
      return {
        ...state,
        appliedFilter: action.payload.filter,
      };

    case ActionTypes.SetFetchedOptions:
      return {
        ...state,
        options: action.payload.options,
      };

    default:
      return state;
  }
}