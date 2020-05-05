/* eslint-disable no-use-before-define */
import React from "react";
import Filter from "./Filter/Filter";

export default function Demo() {
  return (
    <Filter
      inputPlaceholder="Filter"
      inputSelectCategoryText="Select Category"
      filtersConfig={[
        {
          type: "FROM",
          label: "From",
          options: [
            { label: "Wien", value: "vienna" },
            { label: "Salzburg", value: "salzburg" },
            { label: "Linz", value: "linz" },
          ],
          getOptionLabel: (option) => option.label,
          freeSolo: true,
        },
        {
          type: "TO",
          label: "To",
          options: [
            { label: "Wien2", value: "vienna2" },
            { label: "Salzburg2", value: "salzburg2" },
            { label: "Linz2", value: "linz2" },
          ],
          getOptionLabel: (option) => option.label,
          freeSolo: true,
        },
        {
          type: "DELIVERED",
          label: "Delivered",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
          getOptionLabel: (option) => option.label,
        },
      ]}
    />
  );
}
