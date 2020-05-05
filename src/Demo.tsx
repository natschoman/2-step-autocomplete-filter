/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import Filter from "./Filter/Filter";
import { IAppliedFilter } from "./Filter/IFilterConfig";

const Demo = () => {
  const [activeFilters, setActiveFilters] = useState<Array<IAppliedFilter>>([]);

  return (
    <div>
      <Filter
        inputPlaceholder="Filter"
        inputSelectFilterTypeText="Select Category"
        freeSolo={true}
        noOptionsText="Keine Kategorie gefunden"
        filterCategories={[
          {
            type: "FROM",
            label: "From",
            options: [
              { label: "Wien", value: "vienna" },
              { label: "Salzburg", value: "salzburg" },
              { label: "Linz", value: "linz" },
            ],
            freeSolo: true,
            getChipLabel: (appliedFilter) => appliedFilter.type.toUpperCase(),
            getChipValue: (appliedFilter) =>
              appliedFilter.value.toString().toUpperCase(),
          },
          {
            type: "TO",
            label: "To",
            options: [
              { label: "Wien2", value: "vienna2" },
              { label: "Salzburg2", value: "salzburg2" },
              { label: "Linz2", value: "linz2" },
            ],
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
        <h4>Active Filters:</h4>
        <pre>{JSON.stringify(activeFilters, null, " ")}</pre>
      </div>
    </div>
  );
};

export default Demo;
