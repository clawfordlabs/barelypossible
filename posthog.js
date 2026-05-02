(function () {
  var POSTHOG_KEY = "phc_sWvTurUcmupfvuRENFvLo2G8ZMzMAJjPzTRSpMS7XtYw";
  var POSTHOG_HOST = "https://us.i.posthog.com";

  if (!POSTHOG_KEY) return;
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return;
  }

  var script = document.createElement("script");
  script.async = true;
  script.src = POSTHOG_HOST + "/static/array.js";
  script.onload = function () {
    if (!window.posthog || !window.posthog.init) return;

    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });

    window.posthog.capture("$pageview");
  };

  document.head.appendChild(script);
})();
