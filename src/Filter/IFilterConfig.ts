export interface IFilterConfig {
  type: string;
  label: string;
  options: Array<{ label: string; value: any }>;
  getOptionLabel: (option: { label: string; value: any }) => string;
  freeSolo?: boolean;



  // renderSuggestion: (item: string) => string;
  // buildSuggestions?: (searchTerm: string) => any[];
  // fetchSuggestions?: (filter: any, item: any) => any;
  // asyncSuggestions?: Array<{ key: string; value: any }>;
}
