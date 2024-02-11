import Document, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import MainPage from "./pages/MainPage";

class MyDocument extends Document {
	render() {
		return (
      <Html lang="en">
        <Head />
        <body>
          <ColorModeScript initialColorMode="dark" />
          <Main />
          <MainPage />
          <NextScript />
        </body>
      </Html>
    )
	}   
}

export default MyDocument;
