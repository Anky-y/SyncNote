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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((error) =>
      console.error("Service Worker Registration Failed:", error)
    );
}
render(() => <App />, root);
