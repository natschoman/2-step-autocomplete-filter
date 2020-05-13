/* eslint-disable no-use-before-define */
import React, { useState, useRef } from "react";
import Filter from "./Filter/Filter";
import { IAppliedFilter, IOption } from "./Filter/IFilterConfig";
import { stations } from "./stations";

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

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

  const childRef = useRef();

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

  const handleSetSavedFilter = () => {
    setActiveFilters(demoFilters);
  };

  return (
    <div>
      <Filter
        ref={childRef}
        inputPlaceholder="Filter"
        inputSelectFilterTypeText="Select Category"
        freeSolo={true}
        noOptionsText="Keine Kategorie gefunden"
        defaultFilters={defaultFilters}
        filterCategories={[
          {
            type: "FROM",
            label: "From",
            options: stations
              .slice(0, 10)
              .map((station) => ({ label: station.name, value: station.name })),
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
            type: "DELIVERED",
            label: "Delivered",
            options: [
              { label: "YES", value: true },
              { label: "NO", value: false },
            ],
            getOptionLabel: (option) => {
              return option.label.toLowerCase();
            },
            noOptionsText: "Keine Delivered gefunden",
          },
        ]}
        onFilterChange={(filters) => {
          console.log("onFilterChange");
          console.log(filters);
          setActiveFilters(filters);
        }}
      />
      <div>
        <button
          onClick={() => {
            const ref = childRef.current;
            // @ts-ignore

            ref.setFilters(demoFilters);
            // ref.getAlert();
          }}
        >
          Click
        </button>
      </div>
      <div>
        <button type="button" onClick={handleSetSavedFilter}>
          Set Saved Filter
        </button>
      </div>
      <div>
        <h4>Active Filters:</h4>
        <pre>{JSON.stringify(activeFilters, null, " ")}</pre>
      </div>
    </div>
  );
};

export default Demo;
