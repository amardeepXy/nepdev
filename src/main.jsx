import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import store from "./lib/redux/store";
import { QueryProvider } from "@/lib/tanstack-query/QueryProvider";

// Redux
import { Provider as ReduxProvider } from "react-redux";


// App Component
import App from "./App";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
 
  <BrowserRouter>
    <ReduxProvider store={store}>
      <QueryProvider>
      <App />
      </QueryProvider>
    </ReduxProvider>
  </BrowserRouter>
);
