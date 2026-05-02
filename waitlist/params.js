(function () {
  var form = document.querySelector("form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  ["source_path", "feed_source", "episode_id", "attribution_token"].forEach(function (name) {
    var value = params.get(name);
    if (!value) return;

    var input = form.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
  });

  var started = false;

  function fieldValue(selector) {
    var node = form.querySelector(selector);
    return node ? node.value : "";
  }

  function trackSignupStart() {
    if (started) return;
    started = true;

    window.posthog.capture("signup_flow_started", {
      page_path: window.location.pathname,
      source_path: fieldValue('input[name="source_path"]'),
      feed_source: fieldValue('input[name="feed_source"]'),
    });
  }

  form.addEventListener("focusin", trackSignupStart);
  form.addEventListener("input", trackSignupStart);
  form.addEventListener("submit", function () {
    var requestedTopics = fieldValue('textarea[name="requested_topics"]');

    window.posthog.capture("signup_flow_submitted", {
      page_path: window.location.pathname,
      source_path: fieldValue('input[name="source_path"]'),
      feed_source: fieldValue('input[name="feed_source"]'),
      preferred_surface: fieldValue('select[name="preferred_surface"]'),
      requested_topics_present: !!requestedTopics.trim(),
    });
  });
})();
