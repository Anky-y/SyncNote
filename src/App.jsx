import { lazy, createSignal, onMount } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";
import { checkAuth } from "./database/userStorage";

const Login = lazy(() => import("./Pages/Login"));

const Register = lazy(() => import("./Pages/Register"));

const Main = lazy(() => import("./Pages/Main"));

const CreateNote = lazy(() => import("./Pages/CreateNote"));

const UpdateNote = lazy(() => import("./Pages/UpdateNote"));

function App() {
  return (
    <Router>
      <Route path="/" component={Login} />
      <Route path="/Register" component={Register} />
      <Route path="/Main" component={Main} />
      <Route path="/Create-note" component={CreateNote} />
      <Route path="/Update-note" component={UpdateNote} />
    </Router>
  );
}

export default App;
