(() => {
  "use strict";

  function redirectShorts() {
    const url = new URL(window.location.href);
    const match = url.pathname.match(/^\/shorts(?:\/([^/]+))?\/?$/);
    if (!match) return;

    if (match[1]) {
      url.pathname = "/watch";
      url.searchParams.set("v", match[1]);
    } else {
      url.pathname = "/";
      url.search = "";
      url.hash = "";
    }

    // Replace the entry so Back does not lead straight back to Shorts.
    window.location.replace(url.href);
  }

  redirectShorts();
  // YouTube changes routes without reloading the document.
  document.addEventListener("yt-navigate-finish", redirectShorts);
  document.addEventListener("yt-page-data-updated", redirectShorts);
  window.addEventListener("popstate", redirectShorts);
})();
