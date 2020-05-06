export interface IOption { 
  label: string; 
  value: any 
}

export interface IFilterCategory {
  /**
   * The type of the filter, anything but 'TEXT' since this is used for freesolo.
   */
  type: string;
  /**
   * The type of the input, can be 'TEXT', 'DATE' or 'DATE_RANGE', default is 'TEXT'
   */
  inputType?: FilterInputType.Text | FilterInputType.Date | FilterInputType.DateRange
  /**
   * The label of the filter category
   */
  label: string;
  /**
   * The available options if this filter category is selected, not needed if only freesolo or for 'DATE' or 'DATE_RANGE'
   */
  options?: Array<IOption>;
  /**
   * An optional function for returning the label of the option, if ommited the label attribute is used.
   */
  getOptionLabel?: (option: IOption) => string;
  /**
   * 
   */
  fetchOptions?: (input: string) => Promise<Array<IOption>> | Array<IOption>;
  /**
   * Possibility to enter free text in this filter category.
   */
  freeSolo?: boolean;
  /**
   * Text shown if no option with entered value is found (useful with no freeSolo option)
   */
  noOptionsText?: string;

  getChipLabel?: (appliedFilter: IAppliedFilter) => string;
  getChipValue?: (appliedFilter: IAppliedFilter) => string;

  // renderSuggestion: (item: string) => string;
  // buildSuggestions?: (searchTerm: string) => any[];
  // fetchSuggestions?: (filter: any, item: any) => any;
  // asyncSuggestions?: Array<{ key: string; value: any }>;
}

export interface IAppliedFilter {
  type: string;
  value: string | number | boolean;
  label?: string;
}

export enum FilterInputType {
  Text = "TEXT",
  Date = "DATE",
  DateRange = "DATE_RANGE"
}