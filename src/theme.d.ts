import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      sidebar: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      sidebar?: string;
    };
  }
}