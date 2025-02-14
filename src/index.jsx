/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import { lazy } from "solid-js";
import { Router, Route } from "@solidjs/router";

const Login = lazy(() => import("./Pages/Login"));

const Register = lazy(() => import("./Pages/Register"));

const Main = lazy(() => import("./Pages/Main"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
        <Route path="/" component={Login} />
        <Route path="/Register" component={Register} />
        <Route path="/Main" component={Main} />
    </Router>
  ),
  root
);
