import { lazy } from "solid-js";
import { Router, Route } from "@solidjs/router";

const Login = lazy(() => import("./Pages/Login"));

const Register = lazy(() => import("./Pages/Register"));

const Main = lazy(() => import("./Pages/Main"));

const CreateNote = lazy(() => import("./Pages/CreateNote"));

function App() {
  return (
    <Router>
      <Route path="/" component={Login} />
      <Route path="/Register" component={Register} />
      <Route path="/Main" component={Main} />
      <Route path="/Create-note" component={CreateNote} />
    </Router>
  );
}

export default App;
