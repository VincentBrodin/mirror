# mirror

Easy to configure software for smart mirror.

## Installation
```bash
  git clone https://github.com/VincentBrodin/mirror.git
  cd mirror
  bun i
```

## Run mirror
```ini
VITE_OPEN_WEATHER=your_openweather_api_key

# Beszel server credentials
VITE_BESZEL_URL=https://your-beszel-instance
VITE_BESZEL_EMAIL=your_email
VITE_BESZEL_PASSWORD=your_password
VITE_BESZEL_SYSTEM=system_id_or_name

# Spotify OAuth
VITE_SPOTIFY_CLIENT=your_spotify_client_id
VITE_SPOTIFY_CALLBACK=http://your-callback-url
```

```bash
  bun run build
  bun run preview --host
  chromium --kiosk --incognito http://localhost:5173
```
