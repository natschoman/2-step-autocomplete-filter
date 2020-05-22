import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/createPalette' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface PaletteOptions {
    important?: PaletteColorOptions;
  }
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Palette {
    important: PaletteColor;
  }
}

declare module '@material-ui/core/styles/createTypography' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Typography
    extends Record<Variant | 'body3' | 'button2' | 'status' | 'overline2', TypographyStyle>,
      FontStyle,
      TypographyUtils {}

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix, @typescript-eslint/no-empty-interface
  interface TypographyOptions
    extends Partial<Record<Variant | 'body3' | 'button2' | 'status' | 'overline2', TypographyStyleOptions> & FontStyleOptions> {}
}

const backgroundColor = '#ffffff';
const primaryColor = '#4964d0';
const secondaryColor = '#e2002a';
const importantColor = '#3d85d0';
const warningColor = '#f89306';
const successColor = '#51a351';
const infoColor = '#4c4c4c';
const errorColor = '#bd352e';
const textColor = '#1e1f2d';

const roboto = (style: 'normal' | 'italic', weight: number, assetsPath: string) => {
  const fontFace = {
    fontFamily: 'Roboto',
    fontStyle: style,
    fontWeight: weight,
    src: '',
  };

  const generateFontUrl = (pathWithoutFormat: string, format: string) => `url('${pathWithoutFormat}.${format}') format('${format}')`;

  const pathWithoutFormat =
    weight === 400
      ? `${assetsPath}/fonts/roboto-v20-latin-${style === 'normal' ? 'regular' : 'italic'}`
      : `${assetsPath}/fonts/roboto-v20-latin-${weight}${style === 'normal' ? '' : 'italic'}`;
  fontFace.src = `${generateFontUrl(pathWithoutFormat, 'woff')},
    ${generateFontUrl(pathWithoutFormat, 'woff2')}`;

  return fontFace;
};

const frutiger = (weight: number, postfix: string, assetsPath: string) => {
  return {
    fontFamily: 'Frutiger',
    fontWeight: weight,
    src: `url('${assetsPath}/fonts/FrutigerNextPro-${postfix}.woff') format('woff')`,
  };
};

export const getTheme = (assetsPath: string = '') =>
  createMuiTheme({
    typography: {
      // HACK remove !important when all teams upgrade to Frutiger
      fontFamily: `${['Frutiger', 'Arial', 'Helvetica', 'sans-serif'].join(',')} !important`,
      h1: {
        fontWeight: 300,
        fontSize: '5rem',
        lineHeight: '1.2',
      },
      h2: {
        fontWeight: 300,
        fontSize: '4rem',
        lineHeight: '1.143',
      },
      h3: {
        fontWeight: 300,
        fontSize: '2.5rem',
        lineHeight: '1.2',
      },
      h4: {
        fontWeight: 300,
        fontSize: '2rem',
        lineHeight: '1.125',
      },
      h5: {
        fontWeight: 300,
        fontSize: '1.5rem',
        lineHeight: '1.0',
      },
      h6: {
        fontWeight: 300,
        fontSize: '1.25rem',
        lineHeight: '1.2',
      },
      subtitle1: {
        fontWeight: 300,
        fontSize: '1rem',
        lineHeight: '1.5',
      },
      subtitle2: {
        fontWeight: 300,
        fontSize: '0.875rem',
        lineHeight: '1.429',
      },
      body1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: '1.5',
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: '1.429',
      },
      body3: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: '1.333',
      },
      button: {
        fontWeight: 700,
        fontSize: '0.875rem',
        lineHeight: '1.143',
      },
      button2: {
        fontWeight: 700,
        fontSize: '0.75rem',
        lineHeight: '1.167',
      },
      caption: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: '1.167',
      },
      status: {
        fontWeight: 700,
        fontSize: '0.75rem',
        lineHeight: '1.167',
      },
      overline: {
        fontWeight: 700,
        fontSize: '0.625rem',
        lineHeight: '1.4',
      },
      overline2: {
        fontWeight: 700,
        fontSize: '0.625rem',
        lineHeight: '1.4',
      },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [
            ...[100, 300, 400, 500, 700].reduce((acc: any[], item) => {
              acc.push(roboto('normal', item, assetsPath));
              acc.push(roboto('italic', item, assetsPath));
              return acc;
            }, []),
            ...[frutiger(100, 'Light', assetsPath), frutiger(400, 'Regular', assetsPath), frutiger(700, 'Bold', assetsPath)],
          ],
        },
      },
    },
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: backgroundColor,
      },
      important: {
        main: importantColor,
      },
      info: {
        main: infoColor,
      },
      warning: {
        main: warningColor,
      },
      error: {
        main: errorColor,
      },
      success: {
        main: successColor,
      },
      text: {
        primary: textColor,
      },
    },
  });

export const MikeTheme = getTheme();
