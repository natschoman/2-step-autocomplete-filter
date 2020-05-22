import React from "react";
import { Filter } from "./Filter";
import { render } from "../../test/test-utils";
import { fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

// https://github.com/mui-org/material-ui/issues/15726
// @ts-ignore
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: "BODY",
    ownerDocument: document,
  },
});

afterEach(() => {
  jest.clearAllMocks();
});

const props = {
  inputPlaceholder: "+ Filter",
  textFilterChipLabel: "Free-text",
  addOptionPrefixText: "Adding",
  inputSelectFilterTypeText: "Select Category:",
  freeSolo: true,
  noOptionsText: "Nothing Found",
  filterCategories: [
    {
      type: "DELIVERED",
      label: "Delivered",
      options: [
        { label: "YES", value: true },
        { label: "NO", value: false },
      ],
      getOptionLabel: (option: any) => {
        return option.label.toLowerCase();
      },
      noOptionsText: "No Delivered found",
      freeSolo: false,
    },
  ],
  onFilterChange: jest.fn(),
};

describe("<Filter />", () => {
  it("should render properly", () => {
    const { queryByText } = render(<Filter {...props} />);

    // Text "+ Filter text" on empty input
    expect(queryByText(props.inputPlaceholder)).toBeTruthy();
    expect(queryByText(props.inputSelectFilterTypeText)).toBeFalsy();
  });

  it("should show categories and accept free text", () => {
    const {
      queryByText,
      getByRole,
      container,
      getByTestId,
      getAllByTestId,
      queryAllByTestId,
    } = render(<Filter {...props} />);

    const freeText = "deli";

    function checkHighlightIs(expected: string) {
      expect(
        getByRole("listbox").querySelector("li[data-focus]")
      ).toHaveTextContent(expected);
    }

    const filterTextInput = getByTestId("filter-text-input");
    filterTextInput.focus();

    // Text "Select Category:" on focused input
    expect(queryByText(props.inputSelectFilterTypeText)).not.toBeNull();
    expect(queryByText(props.inputPlaceholder)).toBeFalsy();

    fireEvent.change(document.activeElement, { target: { value: freeText } });

    expect(getByRole("listbox").children.length).toBe(2);

    // List should be rendered
    expect(getByRole("listbox").children[0]).toHaveTextContent(
      props.filterCategories[0].label
    );
    expect(getByRole("listbox").children[1]).toHaveTextContent(
      `${props.addOptionPrefixText} "${freeText}"`
    );

    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs(`${props.addOptionPrefixText} "${freeText}"`);

    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // chip should be there
    expect(getAllByTestId("filter-chip").length).toBe(1);
    expect(getByTestId("filter-chip")).toHaveTextContent(
      `${props.textFilterChipLabel}: ${freeText}`
    );

    // onFilterChange should be called
    expect(props.onFilterChange).toBeCalledTimes(1);
    expect(props.onFilterChange).toBeCalledWith([
      { label: freeText, type: "TEXT", value: freeText },
    ]);

    // delete chip
    const chipDeleteSvg = container.querySelector(".MuiChip-deleteIcon");
    fireEvent.click(chipDeleteSvg);

    // chip should be gone
    expect(queryAllByTestId("filter-chip").length).toBe(0);
  });

  it("should accept category select", () => {
    const { queryByText, getByRole, getByTestId, getAllByTestId } = render(
      <Filter {...props} />
    );

    const freeText = "deli";

    function checkHighlightIs(expected) {
      expect(
        getByRole("listbox").querySelector("li[data-focus]")
      ).toHaveTextContent(expected);
    }

    // const filterTextInput = getByRole("textbox");
    const filterTextInput = getByTestId("filter-text-input");
    filterTextInput.focus();

    // enter text
    fireEvent.change(document.activeElement, { target: { value: freeText } });

    // move selection with keyboard arrow
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs(props.filterCategories[0].label);

    // select category
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    const getOptionLabel = props.filterCategories[0].getOptionLabel;

    // check category options (yes and no)
    expect(getByRole("listbox").children.length).toBe(2);
    expect(getByRole("listbox")).toHaveTextContent(
      getOptionLabel(props.filterCategories[0].options[0])
    );
    expect(getByRole("listbox")).toHaveTextContent(
      getOptionLabel(props.filterCategories[0].options[1])
    );

    fireEvent.change(document.activeElement, { target: { value: "YES-X" } });
    expect(queryByText(props.filterCategories[0].noOptionsText)).toBeTruthy();

    fireEvent.change(document.activeElement, { target: { value: "YES" } });
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs(getOptionLabel(props.filterCategories[0].options[0]));
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // onFilterChange should be called
    expect(props.onFilterChange).toBeCalledTimes(1);
    expect(props.onFilterChange).toBeCalledWith([
      {
        label: props.filterCategories[0].options[0].label,
        type: props.filterCategories[0].type,
        value: props.filterCategories[0].options[0].value,
      },
    ]);

    // chip should be there
    expect(getAllByTestId("filter-chip").length).toBe(1);

    expect(getByTestId("filter-chip")).toHaveTextContent(
      `${props.filterCategories[0].type}: ${props.filterCategories[0].options[0].label}`
    );
  });

  it("should fetch new options on input change", async () => {
    const fromDemo = [
      { label: "A 1", value: "A 1" },
      { label: "A 2", value: "A 2" },
      { label: "A 3", value: "A 3" },
      { label: "B 1", value: "B 1" },
      { label: "B 2", value: "B 2" },
      { label: "B 3", value: "B 3" },
      { label: "C 1", value: "C 1" },
      { label: "C 2", value: "C 2" },
      { label: "C 3", value: "C 3" },
    ];

    const getOptionLabel = (option) => option.label.toLowerCase();
    const getChipLabel = (appliedFilter) => appliedFilter.type.toUpperCase();
    const getChipValue = (appliedFilter) =>
      appliedFilter.value.toString().toUpperCase();
    const fetchOptions = (userInput) =>
      fromDemo
        .filter(
          (value) =>
            value.label.toLowerCase().indexOf(userInput.toLowerCase()) === 0
        )
        .slice(0, 3);

    const extendedProps = {
      ...props,
      filterCategories: [
        {
          type: "FROM",
          label: "From",
          options: fromDemo.slice(0, 3),
          fetchOptions: jest.fn(fetchOptions),
          getOptionLabel: jest.fn(getOptionLabel),
          freeSolo: true,
          getChipLabel: jest.fn(getChipLabel),
          getChipValue: jest.fn(getChipValue),
        },
        ...props.filterCategories,
      ],
    };

    const { getByText, getByRole, getByTestId } = render(
      <Filter {...extendedProps} />
    );

    const categoryText = "From";

    function checkHighlightIs(expected) {
      expect(
        getByRole("listbox").querySelector("li[data-focus]")
      ).toHaveTextContent(expected);
    }

    const filterTextInput = getByTestId("filter-text-input");
    filterTextInput.focus();

    fireEvent.change(document.activeElement, {
      target: { value: categoryText },
    });

    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs("From");

    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // check a1 a2 a3
    expect(getByRole("listbox").children.length).toBe(3);
    expect(getByRole("listbox")).toHaveTextContent(getOptionLabel(fromDemo[0]));
    expect(getByRole("listbox")).toHaveTextContent(getOptionLabel(fromDemo[1]));
    expect(getByRole("listbox")).toHaveTextContent(getOptionLabel(fromDemo[2]));

    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledTimes(1);
    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledWith("");

    fireEvent.change(document.activeElement, { target: { value: "B" } });

    await waitFor(() => getByText(`${props.addOptionPrefixText} "B"`));

    expect(getByRole("listbox").children.length).toBe(4);
    expect(getByRole("listbox")).toHaveTextContent(getOptionLabel(fromDemo[3]));
    expect(getByRole("listbox")).toHaveTextContent(getOptionLabel(fromDemo[4]));
    expect(getByRole("listbox")).toHaveTextContent(getOptionLabel(fromDemo[5]));
    expect(getByRole("listbox")).toHaveTextContent(
      `${props.addOptionPrefixText} "B"`
    );

    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledTimes(2);
    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledWith("B");
  });
});
