import React, { FC } from "react";
import { Filter } from "./Filter";
import { render } from "../../test/test-utils";
import {
  fireEvent,
  queryAllByText,
  queryByRole,
  within,
  queryByTestId,
  queryAllByTestId,
  waitFor,
} from "@testing-library/react";
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
  inputSelectFilterTypeText: "Select Category:",
  freeSolo: true,
  noOptionsText: "No Options found.",
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
    const {
      debug,
      getAllByText,
      getByText,
      queryByText,
      getByRole,
      container,
      getByLabelText,
      getByTestId,
      queryAllByText,
    } = render(<Filter {...props} />);

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
      queryByTestId,
      queryAllByTestId,
    } = render(<Filter {...props} />);

    const freeText = "deli";

    function checkHighlightIs(expected: string) {
      expect(
        getByRole("listbox").querySelector("li[data-focus]")
      ).toHaveTextContent(expected);
    }

    // const filterTextInput = getByRole("textbox");
    const filterTextInput = getByTestId("filter-text-input");
    filterTextInput.focus();

    // Text "Select Category:" on focused input
    expect(queryByText(props.inputSelectFilterTypeText)).toBeTruthy();
    expect(queryByText(props.inputPlaceholder)).toBeFalsy();

    fireEvent.change(document.activeElement, { target: { value: freeText } });

    expect(getByRole("listbox").children.length).toBe(2);

    // List should be rendered
    expect(getByRole("listbox").children[0]).toHaveTextContent("Delivered");
    expect(getByRole("listbox").children[1]).toHaveTextContent(
      `Add "${freeText}"`
    );

    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs('Add "deli"');

    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // chip should be there
    expect(getAllByTestId("filter-chip").length).toBe(1);
    expect(getByTestId("filter-chip")).toHaveTextContent("Text: deli");

    // onFilterChange should be called
    expect(props.onFilterChange).toBeCalledTimes(1);
    expect(props.onFilterChange).toBeCalledWith([
      { label: "deli", type: "TEXT", value: "deli" },
    ]);

    // delete chip
    const chipDeleteSvg = container.querySelector(".MuiChip-deleteIcon");
    fireEvent.click(chipDeleteSvg);

    // chip should be gone
    expect(queryAllByTestId("filter-chip").length).toBe(0);
  });

  it("should accept category select", () => {
    const {
      debug,
      getAllByText,
      getByText,
      queryByText,
      getByRole,
      container,
      getByLabelText,
      getByTestId,
      queryAllByText,
      queryByLabelText,
      queryByTitle,
      getAllByTestId,
      queryByTestId,
      queryAllByTestId,
    } = render(<Filter {...props} />);

    const freeText = "deli";

    function checkHighlightIs(expected) {
      expect(
        getByRole("listbox").querySelector("li[data-focus]")
      ).toHaveTextContent(expected);
    }

    // const filterTextInput = getByRole("textbox");
    const filterTextInput = getByTestId("filter-text-input");
    filterTextInput.focus();

    fireEvent.change(document.activeElement, { target: { value: freeText } });

    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs("Delivered");

    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    expect(getByRole("listbox").children.length).toBe(2);
    expect(getByRole("listbox")).toHaveTextContent("yes");
    expect(getByRole("listbox")).toHaveTextContent("no");

    fireEvent.change(document.activeElement, { target: { value: "YES-X" } });
    expect(queryByText("No Delivered found")).toBeTruthy();

    fireEvent.change(document.activeElement, { target: { value: "YES" } });
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs("yes");
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // onFilterChange should be called
    expect(props.onFilterChange).toBeCalledTimes(1);
    expect(props.onFilterChange).toBeCalledWith([
      { label: "YES", type: "DELIVERED", value: true },
    ]);

    // chip should be there
    expect(getAllByTestId("filter-chip").length).toBe(1);
    expect(getByTestId("filter-chip")).toHaveTextContent("DELIVERED: YES");
  });

  it("should accept category select", async () => {
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

    const extendedProps = {
      ...props,
      filterCategories: [
        {
          type: "FROM",
          label: "From",
          options: fromDemo.slice(0, 3),
          fetchOptions: jest.fn((userInput) =>
            fromDemo
              .filter(
                (value) =>
                  value.label.toLowerCase().indexOf(userInput.toLowerCase()) ===
                  0
              )
              .slice(0, 3)
          ),
          getOptionLabel: jest.fn((option) => option.label.toLowerCase()),
          freeSolo: true,

          getChipLabel: jest.fn((appliedFilter) =>
            appliedFilter.type.toUpperCase()
          ),
          getChipValue: jest.fn((appliedFilter) =>
            appliedFilter.value.toString().toUpperCase()
          ),
        },
        ...props.filterCategories,
      ],
    };

    const {
      debug,
      getAllByText,
      getByText,
      queryByText,
      getByRole,
      container,
      getByLabelText,
      getByTestId,
      queryAllByText,
      queryByLabelText,
      queryByTitle,
      getAllByTestId,
      queryByTestId,
      queryAllByTestId,
    } = render(<Filter {...extendedProps} />);

    const categoryText = "From";

    function checkHighlightIs(expected) {
      expect(
        getByRole("listbox").querySelector("li[data-focus]")
      ).toHaveTextContent(expected);
    }

    // const filterTextInput = getByRole("textbox");
    const filterTextInput = getByTestId("filter-text-input");
    filterTextInput.focus();

    // console.log("#1 debug: --------");
    // debug();

    fireEvent.change(document.activeElement, {
      target: { value: categoryText },
    });

    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs("From");

    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // console.log("#2 debug: --------");
    // debug();

    // check A1 A2 A3
    expect(getByRole("listbox").children.length).toBe(3);
    expect(getByRole("listbox")).toHaveTextContent("a 1");
    expect(getByRole("listbox")).toHaveTextContent("a 2");
    expect(getByRole("listbox")).toHaveTextContent("a 3");

    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledTimes(1);
    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledWith("");

    // expect(extendedProps.filterCategories[0].getChipLabel).toBeCalledTimes(1);
    // expect(extendedProps.filterCategories[0].getChipValue).toBeCalledTimes(1);

    fireEvent.change(document.activeElement, { target: { value: "B" } });

    await waitFor(() => getByText('Add "B"'));

    //await sleep(200);
    // await waitFor(() =>
    //   expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledTimes(2)
    // );

    console.log("#4 debug: --------");
    debug();

    /*
    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledTimes(2);
    expect(extendedProps.filterCategories[0].fetchOptions).toBeCalledWith("B");
    expect(getByRole("listbox")).toHaveTextContent("YES");
    expect(getByRole("listbox")).toHaveTextContent("NO");

    // filterTextInput.focus();

    expect(queryByText("No Delivered found")).toBeTruthy();

    fireEvent.change(document.activeElement, { target: { value: "YES" } });
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" });
    checkHighlightIs("YES");
    fireEvent.keyDown(document.activeElement, { key: "Enter" });

    // onFilterChange should be called
    expect(props.onFilterChange).toBeCalledTimes(1);
    expect(props.onFilterChange).toBeCalledWith([
      { label: "YES", type: "DELIVERED", value: true },
    ]);

    console.log("#5 debug: --------");
    debug();

    // chip should be there
    expect(getAllByTestId("filter-chip").length).toBe(1);
    expect(getByTestId("filter-chip")).toHaveTextContent("DELIVERED: YES");
    */
  });
});

function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
