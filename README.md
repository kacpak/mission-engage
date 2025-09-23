# Setting up demo machine

Create `/etc/init.d/workflow-studio-quest-ui` file with contents below

```sh
/usr/bin/google-chrome --kiosk http://localhost:4123 --autoplay-policy=no-user-gesture-required
```

Ideas

- on how to play, when users moves astronaut tangible to "help", I can make a rocket crash into the moon icon of help card and explode as a transition to next step

# How to run production

Requirements
- bun ([Intallation guide](https://bun.com/docs/installation#macos-and-linux))

Instructions

```shell
bun install && \
  bun run build && \
  bun run start
```

Game: http://localhost:4123  
Admin panel: http://localhost:4123/admin.html

# Configuring in runtime

We can configure the client app via localStorage

- `MOCK` -> `true`|`false` enables hardware mocking (please refresh the page after changing)
- `WS_URL` -> url to websocket server reporting data from the hardware