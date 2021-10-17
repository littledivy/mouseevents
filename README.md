### Mouse events in Deno

Beware: FFI requires `--unstable`

Works on Windows, Mac and Linux (X11). `click` events are only support on Linux
devices with `/dev/input/mice` character device.

```javascript
import { init } from "https://deno.land/x/mouse/mod.ts";

window.addEventListener("mousemove", (e) => {
  console.log(e.screenX);
});

// `click` is only supported on Linux
window.addEventListener("click", (e) => {
  console.log(e.buttons);
});

await init();
```

<a href='https://ko-fi.com/littledivy' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

#### License

MIT
