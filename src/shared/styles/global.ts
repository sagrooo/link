import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

  @font-face {
    font-family: 'Iconsax';
    src: url('./fonts/iconsax.eot');
    src: url('./fonts/iconsax.eot?#iefix') format('embedded-opentype'),
    url('./fonts/iconsax.woff') format('woff'),
    url('./fonts/iconsax.ttf') format('truetype'),
    url('./fonts/iconsax.svg#Iconsax') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    background-color: #f5f5f5;
  }

  span {
    font-family: 'Poppins', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  .iconsax {
    font-family: 'Iconsax', serif !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
