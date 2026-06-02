/*
On startup, connect to the "NativeHostClicker" app.
*/
console.log('Connecting to NativeHostClicker');
let port = browser.runtime.connectNative("NativeHostClicker");

/*
Listen for messages from the app and log them to the console.
*/
port.onMessage.addListener((response) => {
	console.log("example@rex.com background.js received: " + response);
});

/*
Listen for the native messaging port closing.
*/
port.onDisconnect.addListener((port) => {
  if (port.error) {
    console.log(`example@rex.com disconnected due to an error: ${port.error.message}`);
  } else {
    // The port closed for an unspecified reason. If this occurred right after
    // calling `browser.runtime.connectNative()` there may have been a problem
    // starting the native messaging client in the first place.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging#troubleshooting
    console.log(`example@rex.com background.js disconnected`, port);
  }
});

browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "nativeClick" && msg.app_key) {
    console.log("Sending to example@rex.com native host");		
    port.postMessage({
        type: "click",
        app_key: 1,
        x: msg.x,
        y: msg.y
    });
  } else {
    console.log("example@rex.com: unexpected onMessage()");
    console.log(msg);
  }
});
