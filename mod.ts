import AutoPilot from "https://deno.land/x/autopilot@0.3.2/mod.ts";

const pilot = new AutoPilot();

export async function init() {
  let fd: null | Deno.File = null;
  if (Deno.build.os == "linux") {
    try {
      fd = await Deno.open("/dev/input/mice");
    } catch (e) {
      // You could've made my life easier by just using Linux!
    }
  }

  if (!fd) {
    throw new TypeError("Not supported");
  }

  const screenSize = pilot.screenSize();
  setInterval(async () => {
    // deno-lint-ignore no-explicit-any
    let props: any = {};
    let ty = "mousemove";
    if (fd) {
      const buf = new Uint8Array(3);
      await fd.read(buf);
      ty = parse(props, buf);
    }

    const pos = pilot.mousePosition();

    // TODO(littledivy): support for console relative position
    // const { columns, rows } = Deno.consoleSize(Deno.stdout.rid);
    //
    // props.x = props.clientX = {
    //   get() {
    //     return (pos.x / screenSize.width) * columns;
    //   },
    // };
    //
    // props.y = props.clienty = {
    //   get() {
    //     return (pos.x / screenSize.height) * rows;
    //   },
    // };

    props.pageX = props.screenX = {
      get() {
        return pos.x;
      },
    };

    props.pageY = props.screenY = {
      get() {
        return pos.y;
      },
    };

    props.region = props.relatedTarget = {
      get() {
        return null;
      },
    };

    const ev = new Event(ty);
    Object.defineProperties(ev, props);
    window.dispatchEvent(ev);
  }, 1);
}

// deno-lint-ignore no-explicit-any
function parse(props: any, buffer: Uint8Array) {
  const view = new DataView(buffer.buffer);

  let buttons = 0;
  // left button
  if ((buffer[0] & 1) > 0) buttons += 1;
  // right button
  if ((buffer[0] & 2) > 0) buttons += 2;
  // middle button
  if ((buffer[0] & 4) > 0) buttons += 4;

  props.movementX = {
    get() {
      return view.getInt8(1);
    },
  };

  props.movementY = {
    get() {
      return view.getInt8(2);
    },
  };
  props.buttons = {
    get() {
      return buttons;
    },
  };

  return buttons > 0 ? "click" : "mousemove";
}

window.addEventListener("click", (e) => {
  // @ts-ignore 
  console.log(e.buttons);
});

window.addEventListener("mousemove", (e) => {
  // @ts-ignore 
  console.log(e.screenX);
});

await init();
