# Setting up demo machine

Create `/etc/init.d/workflow-studio-quest-ui` file with contents below

```sh
/usr/bin/google-chrome --kiosk https://ip-of-the-hardware-controller:port --autoplay-policy=no-user-gesture-required
```

Ideas

- on how to play, when users moves astronaut tangible to "help", I can make a rocket crash into the moon icon of help card and explode as a transition to next step

# How to run production

Requirements
- nodejs 22.17.1
- pnpm 10.15.0

Instructions

```shell
pnpm install
pnpm build
pnpm start
```