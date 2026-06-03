console.log("example@rex.com background loaded");

let port = null;
let attempted = false;

browser.runtime.onMessage.addListener((msg) => {
	console.log("background received:", msg);
	if (!(msg.type === "nativeClick" && msg.app_key)) {
    console.log("example@rex.com: unexpected onMessage()");
		return Promise.resolve({ ok: false, error: "Unexpected message" });
	}

	try {
		if (!attempted) {
      connect();
      if (!port) {
        console.log("example@rex.com native host is not connected");
        return;
      }
			attempted = true;

      console.log("Sending to example@rex.com native host");
			port.postMessage({
				type: "click",
				app_key: 1,
				x: msg.x,
				y: msg.y
			});
			setTimeout(function () {
				attempted = false;
			}, 1000);
		}
		return Promise.resolve({ ok: true });
	} catch (e) {
		console.error("native click failed:", e);
			setTimeout(function () {
				attempted = false;
			}, 3500);
		return Promise.resolve({ ok: false, error: String(e) });
	}
});

function connect() {
  if (!port) {
    console.log("Connecting to NativeHostClicker");
    port = browser.runtime.connectNative("NativeHostClicker");

    port.onMessage.addListener((response) => {
      console.log("example@rex.com background.js received:", response);
    });

    port.onDisconnect.addListener((disconnectedPort) => {
      if (disconnectedPort.error) {
        console.log(`example@rex.com disconnected due to an error: ${disconnectedPort.error.message}`);
      } else {
        // If this happens right after connectNative(), Firefox probably could not
        // find, launch, or authorize the native messaging host.
        console.log("example@rex.com background.js disconnected", disconnectedPort);
      }
        port = null;
      });
  }
}
