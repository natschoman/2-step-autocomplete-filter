import React, { FC } from "react";
import { Chip } from "@material-ui/core";
import { IFilterCategory, IAppliedFilter } from "./IFilterConfig";
import { useStyles } from "./Filter.styles";

interface IOwnProps {
  filter: IAppliedFilter;
  filterCategory?: IFilterCategory;
  deleteFilter: Function;
  textFilterChipLabel: string;
}
export const FilterChip: FC<IOwnProps> = ({
  filter,
  filterCategory,
  deleteFilter,
  textFilterChipLabel,
}) => {
  const classes = useStyles();

  return (
    <Chip
      variant="outlined"
      data-testid="filter-chip"
      label={
        filter.type === "TEXT" ? (
          <>
            {textFilterChipLabel}: <strong>{filter.value}</strong>
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
      onDelete={() => deleteFilter()}
      className={classes.chip}
    />
  );
};
