const API_BASE = "http://127.0.0.1:4000/api";

const toReadableError = (error) => {
  if (error instanceof TypeError) {
    return new Error("Sunucuya baglanilamadi. Koku dizinde `npm run dev` komutunu calistirin.");
  }

  return error;
};

let accessToken = null;
let csrfToken = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token) => {
    accessToken = token;
  }
};

export const ensureCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/auth/csrf-token`, {
    credentials: "include"
  }).catch((error) => {
    throw toReadableError(error);
  });
  const data = await response.json();
  csrfToken = data.csrfToken;
  return csrfToken;
};

export const apiFetch = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (tokenStore.getAccessToken()) {
    headers.set("Authorization", `Bearer ${tokenStore.getAccessToken()}`);
  }

  if (!["GET", "HEAD"].includes((options.method || "GET").toUpperCase())) {
    headers.set("x-csrf-token", await ensureCsrfToken());
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: "include"
    });
  } catch (error) {
    throw toReadableError(error);
  }

  if (response.status === 401 && path !== "/auth/refresh" && tokenStore.getAccessToken()) {
    const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "x-csrf-token": await ensureCsrfToken() }
    });

    if (refreshed.ok) {
      const refreshData = await refreshed.json();
      tokenStore.setAccessToken(refreshData.accessToken);
      headers.set("Authorization", `Bearer ${refreshData.accessToken}`);
      try {
        response = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers,
          credentials: "include"
        });
      } catch (error) {
        throw toReadableError(error);
      }
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Istek basarisiz." }));
    throw new Error(error.message || "Istek basarisiz.");
  }

  if (response.status === 204) return null;
  return response.json();
};
