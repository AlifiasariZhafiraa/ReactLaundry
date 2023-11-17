import { createTheme } from "@mui/material";

//theme warna

const mdTheme = createTheme(
  {
    palette: {
      primary: {
        light: '#ffd967',
        main: '#ffa735',
        dark: '#c77800',
        contrastText: '#ffffff',
      },
      secondary: {
        soft: '#f3e5f5',
        light: '#62eeff',
        main: '#00bbd3',
        dark: '#008ba2',
        contrastText: '#ffffff',
      },
      light: {
        dark: '#BDBDBD',
        main: '#83AB81',
      },
      action: {
        hover: '#fffde7'
      }
    },
  }
)

export default mdTheme
