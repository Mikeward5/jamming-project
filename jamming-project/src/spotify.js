const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const scope = "playlist-modify-private playlist-modify-public";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

// Prevent duplicate callback processing
let callbackPromise = null;
let refreshPromise = null;

// Generate a secure random string
const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const values = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(values, (x) => possible[x % possible.length]).join("");
};

// Hash the PKCE verifier
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  return crypto.subtle.digest("SHA-256", data);
};

// Convert hash to Base64URL
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// Start Spotify login
export async function redirectToSpotify() {
  if (!clientId || !redirectUri) {
    throw new Error("Spotify environment variables are missing");
  }

  const codeVerifier = generateRandomString(64);
  const state = generateRandomString(32);

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  sessionStorage.setItem("code_verifier", codeVerifier);
  sessionStorage.setItem("spotify_auth_state", state);

  const authUrl = new URL(AUTH_URL);

  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  }).toString();

  window.location.assign(authUrl.toString());
}

// Save Spotify tokens
function storeTokens(tokens) {
  if (!tokens.access_token) {
    throw new Error("Spotify did not return an access token");
  }

  sessionStorage.setItem("spotify_access_token", tokens.access_token);

  sessionStorage.setItem(
    "spotify_expires_at",
    String(Date.now() + tokens.expires_in * 1000),
  );

  if (tokens.refresh_token) {
    sessionStorage.setItem("spotify_refresh_token", tokens.refresh_token);
  }
}

// Exchange authorization code for tokens
export async function getToken(code) {
  const codeVerifier = sessionStorage.getItem("code_verifier");

  if (!codeVerifier) {
    throw new Error("Missing PKCE code verifier");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Spotify token request failed: ${response.status} ${errorText}`,
    );
  }

  const tokens = await response.json();

  storeTokens(tokens);

  sessionStorage.removeItem("code_verifier");
  sessionStorage.removeItem("spotify_auth_state");

  return tokens.access_token;
}

// Handle Spotify redirect
export async function handleSpotifyCallback() {
  const url = new URL(window.location.href);
  const callbackPath = new URL(redirectUri).pathname;

  if (url.pathname !== callbackPath) {
    return null;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  const savedState = sessionStorage.getItem("spotify_auth_state");

  if (error) {
    throw new Error(`Spotify authorization failed: ${error}`);
  }

  if (!code) {
    throw new Error("Spotify did not return an authorization code");
  }

  if (!savedState || returnedState !== savedState) {
    throw new Error("Spotify authorization state mismatch");
  }

  // Exchange code before removing callback URL
  const accessToken = await getToken(code);

  // Remove sensitive callback parameters
  window.history.replaceState({}, "", "/");

  return accessToken;
}

// Ensure callback is only processed once
export function processSpotifyCallback() {
  if (!callbackPromise) {
    callbackPromise = handleSpotifyCallback();
  }

  return callbackPromise;
}

// Retrieve a valid access token
export async function getAccessToken() {
  const accessToken = sessionStorage.getItem("spotify_access_token");

  const expiresAt = Number(sessionStorage.getItem("spotify_expires_at") || 0);

  // Return existing token if still valid
  if (accessToken && Date.now() < expiresAt - 60000) {
    return accessToken;
  }

  const refreshToken = sessionStorage.getItem("spotify_refresh_token");

  if (!refreshToken) {
    return null;
  }

  // Prevent duplicate refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Spotify token refresh failed: ${response.status}`);
    }

    const tokens = await response.json();

    storeTokens(tokens);

    return tokens.access_token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function searchTracks(searchTerm) {
  if (!searchTerm.trim()) {
    return [];
  }

  const token = await getAccessToken();

  if (!token) {
    throw new Error("Please log in to Spotify first");
  }

  const url = new URL("https://api.spotify.com/v1/search");

  url.search = new URLSearchParams({
    q: searchTerm.trim(),
    type: "track",
    limit: "10",
  }).toString();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text();

    console.error("Spotify API error:", response.status, errorDetails);

    throw new Error(`Spotify search failed: ${response.status}`);
  }

  const data = await response.json();

  return (data.tracks?.items ?? []).map((track) => ({
    id: track.id,
    name: track.name,
    author: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    uri: track.uri,
  }));
}
