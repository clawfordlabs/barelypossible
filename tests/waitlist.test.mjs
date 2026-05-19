import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../waitlist/index.html", import.meta.url), "utf8");
const script = fs.readFileSync(new URL("../waitlist/params.js", import.meta.url), "utf8");

function makeElement({ name = "", value = "" } = {}) {
  return {
    hidden: false,
    name,
    type: "",
    value,
    textContent: "",
    children: [],
    classList: {
      classes: new Set(),
      add(className) {
        this.classes.add(className);
      },
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    addEventListener() {},
    querySelector(selector) {
      const nameMatch = selector.match(/name="([^"]+)"/);
      if (!nameMatch) return null;
      return this.children.find((child) => child.name === nameMatch[1]) || null;
    },
  };
}

function runWaitlistScript(search) {
  const sourcePathInput = makeElement({ name: "source_path", value: "barelypossible_waitlist" });
  const feedSourceInput = makeElement({ name: "feed_source", value: "site" });
  const emailInput = makeElement({ name: "email" });
  const topicsInput = makeElement({ name: "requested_topics" });
  const surfaceInput = makeElement({ name: "preferred_surface", value: "private_feed" });
  const form = makeElement();
  form.children.push(sourcePathInput, feedSourceInput, emailInput, topicsInput, surfaceInput);

  const confirmation = makeElement();
  confirmation.hidden = true;
  const statusMessage = makeElement();

  const document = {
    createElement: () => makeElement(),
    querySelector(selector) {
      if (selector === "form") return form;
      if (selector === "[data-waitlist-confirmation]") return confirmation;
      if (selector === "[data-waitlist-status-message]") return statusMessage;
      return null;
    },
  };

  const context = {
    document,
    window: {
      location: { pathname: "/waitlist/", search },
      posthog: { capture() {} },
    },
    URLSearchParams,
  };

  vm.runInNewContext(script, context);
  return { form, confirmation, statusMessage };
}

assert.match(
  html,
  /action="https:\/\/beacon-inbound-api\.onrender\.com\/waitlist"/,
  "waitlist form should submit to the production Beacon inbound API",
);

{
  const { form, confirmation, statusMessage } = runWaitlistScript("?waitlist_status=joined");

  assert.equal(form.hidden, true, "joined redirect should hide the signup form");
  assert.equal(confirmation.hidden, false, "joined redirect should show the confirmation panel");
  assert.equal(
    statusMessage.textContent,
    "You're on the list. We'll follow up when private briefings are ready.",
  );
}

