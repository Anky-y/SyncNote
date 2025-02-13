import styles from ".././App.module.css";
import { createSignal } from "solid-js";
function Login() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
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

    console.log(data);
  };

  return (
    <div class="flex flex-col justify-center items-center min-h-screen p-6 w-full bg-gradient-to-r from-green-200 to-green-300">
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-semibold text-green-800 mb-8">
        SyncNote
      </h1>

      <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <input
          type="text"
          placeholder="Username"
          class="my-3 p-4 w-full rounded-xl border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          class="my-3 p-4 w-full rounded-xl border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
        />

        <button
          class="my-4 p-3 w-full bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition-all"
          onclick={handleLogin}
        >
          Login
        </button>

        <p class="text-center text-green-600">
          Don't have an account?{" "}
          <a
            href="/register"
            class="text-green-500 font-semibold hover:underline"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
