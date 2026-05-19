(function () {
  var form = document.querySelector("form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var waitlistStatus = params.get("waitlist_status");
  var confirmation = document.querySelector("[data-waitlist-confirmation]");
  var statusMessage = document.querySelector("[data-waitlist-status-message]");

  function showWaitlistStatus(message, isError) {
    if (!confirmation || !statusMessage) return;

    statusMessage.textContent = message;
    confirmation.hidden = false;
    confirmation.classList.add(isError ? "is-error" : "is-success");
    form.hidden = true;
  }

  if (waitlistStatus === "joined") {
    showWaitlistStatus("You're on the list. We'll follow up when private briefings are ready.", false);

    if (window.posthog) {
      window.posthog.capture("signup_flow_joined", {
        page_path: window.location.pathname,
        source_path: params.get("source_path") || "",
        feed_source: params.get("feed_source") || "",
      });
    }
  } else if (waitlistStatus === "error") {
    showWaitlistStatus(params.get("waitlist_error") || "Something went wrong. Please try again.", true);
  }

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
