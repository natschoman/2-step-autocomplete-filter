import React, { FC } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/core";
import { MikeTheme } from "../theme";

const Wrapper: FC = ({ children }) => (
  <ThemeProvider theme={MikeTheme}>{children}</ThemeProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: Wrapper, ...options });

// override render method
export { customRender as render };
