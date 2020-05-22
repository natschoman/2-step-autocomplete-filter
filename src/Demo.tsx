/* eslint-disable no-use-before-define */
import React, { useState, useRef } from "react";
import { Filter, FilterRefObject } from "./Filter/Filter";
import {
  IAppliedFilter,
  IOption,
  FilterInputType,
} from "./Filter/IFilterConfig";
import { stations } from "./stations";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";

const demoFilters = [
  {
    type: "FROM",
    value: "ALMAGRO",
    label: "ALMAGRO",
  },
  {
    type: "TO",
    value: "Abschlag",
    label: "Abschlag",
  },
  {
    type: "TEXT",
    label: "Test",
    value: "Test",
  },
];

const defaultFilters = [
  {
    type: "FROM",
    value: "ALMAGRO",
    label: "ALMAGRO",
  },
];

function simulateAsyncCall(userInput: string): Promise<Array<IOption>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredStations = stations
        .filter(
          (station) =>
            station.name.toLowerCase().indexOf(userInput.toLowerCase()) === 0
        )
        .slice(0, 10)
        .map((station) => ({ value: station.name, label: station.name }));

      resolve(filteredStations);
    }, 300);
  });
}

const Demo = () => {
  const [activeFilters, setActiveFilters] = useState<Array<IAppliedFilter>>(
    defaultFilters
  );

  const childRef = useRef<FilterRefObject>(null);

  const handleFetchOptionsFromAsync = async (userInput: string) => {
    console.log("handleFetchOptionsFromAsync", userInput);
    const result = await simulateAsyncCall(userInput);
    return result;
  };

  const handleFetchOptionsToSync = (userInput: string) => {
    console.log("handleFetchOptionsToSync", userInput);

    const filteredStations = stations
      .filter(
        (station) =>
          station.name.toLowerCase().indexOf(userInput.toLowerCase()) === 0
      )
      .slice(0, 10)
      .map((station) => ({ value: station.name, label: station.name }));
    return filteredStations;
  };

  return (
    <ThemeProvider theme={createMuiTheme({ palette: { primary: red } })}>
      <div>
        <Filter
          textFilterChipLabel="Texti"
          addOptionPrefixText="Dazu"
          ref={childRef}
          inputPlaceholder="+ Filter"
          inputSelectFilterTypeText="Select Category: "
          freeSolo={true}
          noOptionsText="Keine Kategorie gefunden"
          // defaultFilters={defaultFilters}
          filterCategories={[
            {
              type: "FROM",
              label: "From",
              options: stations.slice(0, 10).map((station) => ({
                label: station.name,
                value: station.name,
              })),
              getOptionLabel: (option) => option.label.toLowerCase(),
              fetchOptions: handleFetchOptionsFromAsync,

              freeSolo: true,

              getChipLabel: (appliedFilter) => appliedFilter.type.toUpperCase(),
              getChipValue: (appliedFilter) =>
                appliedFilter.value.toString().toUpperCase(),
            },
            {
              type: "TO",
              label: "To",
              options: [],
              getOptionLabel: (option) => option.label.toUpperCase(),
              fetchOptions: handleFetchOptionsToSync,

              freeSolo: true,
            },
            {
              type: "LOT_OF_DATA",
              label: "LotOfData",
              options: stations.map((station) => ({
                value: station.name,
                label: station.name,
              })),
              getOptionLabel: (option) => option.label.toUpperCase(),

              freeSolo: true,
            },
            {
              // freeSolo: true,
              type: "DELIVERED",
              label: "Delivered",
              options: [
                { label: "YES", value: "YES" },
                { label: "NO", value: "NO" },
              ],
              getOptionLabel: (option) => {
                return option.label.toLowerCase();
              },
              noOptionsText: "Keine Delivered gefunden",
            },
            {
              inputType: FilterInputType.Date,
              type: "DateFrom",
              label: "DateFrom",
            },
          ]}
          onFilterChange={(filters: any) => {
            console.log("onFilterChange");
            console.log(filters);
            setActiveFilters(filters);
          }}
        />
        <div>
          <button
            onClick={() => {
              const ref = childRef.current;
              if (ref) ref.setFilters(demoFilters);
            }}
          >
            Set Filter from Outside
          </button>
        </div>
        <div>
          <h4>Active Filters:</h4>
          <pre>{JSON.stringify(activeFilters, null, " ")}</pre>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Demo;
