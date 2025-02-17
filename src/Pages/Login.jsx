import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { saveLoggedInUserLocally, checkAuth } from "../database/userStorage";
function Login() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  onMount(async () => {
    console.log("mounted");
    if (await checkAuth()) {
      navigate("/Main");
    }
  });

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      credentials: "include", // Important for cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username(),
        password: password(),
      }),
    });
    const data = await res.json();

    await saveLoggedInUserLocally(data.user);

    if (res.ok) {
      localStorage.setItem("authToken", data.token); // Store token for offline use
      navigate("/Main");
    } else {
      console.error("Login failed:", data.message);
      alert("Login failed: " + (data.message || "Please try again"));
    }
  };

  return (
    <div class="flex flex-col justify-center items-center min-h-screen p-6 w-full bg-background">
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-semibold text-dark mb-8">
        SyncNote
      </h1>

      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <input
          type="text"
          placeholder="Username"
          class="my-3 p-4 w-full rounded-xl border-2 border-input-border focus:outline-none focus:ring-2 focus:ring-input-focus-border focus:border-none transition-all"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          class="my-3 p-4 w-full rounded-xl border-2 border-input-border focus:outline-none focus:ring-2 focus:ring-input-focus-border focus:border-none transition-all"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
        />

        <button
          class="my-4 p-3 w-full bg-button-background text-dark font-semibold rounded-xl shadow-md hover:bg-link-hover transition-all cursor-pointer"
          onclick={handleLogin}
        >
          Login
        </button>

        <p class="text-center text-dark">
          Don't have an account?{" "}
          <a
            href="/register"
            class="text-primary font-semibold hover:underline"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
