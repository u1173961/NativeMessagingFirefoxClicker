MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

let attempts = 0;
let changing = false;
let observer = new MutationObserver(function(mutations, observer) {
	let ads = document.querySelectorAll('.ad-showing');
	if (ads.length > 0) {
		const mute = document.querySelector('.ytp-volume-icon');
		if (mute.getAttribute('data-title-no-tooltip') === 'Mute') {
			changing = true;
			mute.click();
		}
		const skip = document.querySelector('.ytp-skip-ad-button');
		if (skip) {
			if (attempts < 1) {
				attempts++;
				let xy = getScreenCenter(skip);
				console.log("xy:", xy);
				browser.runtime.sendMessage({
				  type: "nativeClick",
				  app_key: 1,
				  x: xy.x,
				  y: xy.y
				}).then(response => {
				  console.log("Response:", response);
				}).catch(error => {
				  console.error("sendMessage error:", error);
				});
				setTimeout(function() {
					attempts = 0;
				}, 600);
			}
		}
	} else if (changing) {
		const mute = document.querySelector('.ytp-volume-icon');
		if (mute.getAttribute('data-title-no-tooltip') === 'Unmute') {
			mute.click();
		}
		const play = document.querySelector('.ytp-play-button');
		if (play.getAttribute('data-title-no-tooltip') === 'Play') {
			play.click();
		}
		changing = false;
	}
});
observer.observe(document, {
  subtree: true,
  attributes: true,
  childList: true
});

function getScreenCenter(el) {
  const rect = el.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  return {
    x: Math.round((window.mozInnerScreenX + rect.left + rect.width / 2) * dpr),
    y: Math.round((window.mozInnerScreenY + rect.top + rect.height / 2) * dpr)
  };
}
