MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
	var ads = document.querySelectorAll('.ad-showing');
	if (ads.length > 0) {
		const mute = document.querySelector('.ytp-volume-icon');
		if (mute.getAttribute('data-title-no-tooltip') === 'Mute') {
			mute.click();
		}
		const skip = document.querySelector('.ytp-skip-ad-button');
		if (skip) {
			const rect = skip.getBoundingClientRect();
			browser.runtime.sendMessage({
			  type: "nativeClick",
			  app_key: 1,
			  x: window.screenX + rect.left + rect.width / 2,
			  y: window.screenY + rect.top + rect.height / 2
			});
		}
	} else {			
		var mute = document.querySelector('.ytp-volume-icon');
		if (mute.getAttribute('data-title-no-tooltip') === 'Unmute') {
			mute.click();
		}
	}
});
observer.observe(document, {
  subtree: true,
  attributes: true,
  childList: true
});