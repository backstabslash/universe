import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// import App from "./components/App.tsx";
import MainPage from "./components/MainPage";
import "./styles/globalstyles.css";

const theme = extendTheme({
	
});


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<MainPage />
		</ChakraProvider>
	</React.StrictMode>
);
