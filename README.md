# Setting up demo machine

Add create `/etc/init.d/workflow-studio-quest` file with contents below

```sh
/usr/bin/google-chrome --kiosk https://ip-of-the-hardware-controller:port --autoplay-policy=no-user-gesture-required
```
