const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { runInNewContext } = require("node:vm");
const source = readFileSync(`${__dirname}/../content.js`, "utf8");

function load(href) {
  const replacements = [];
  const events = {};
  const window = {
    location: { href, replace: (url) => replacements.push(url) },
    addEventListener: (name, handler) => { events[name] = handler; },
  };
  const document = {
    addEventListener: (name, handler) => { events[name] = handler; },
  };
  runInNewContext(source, { window, document, URL });
  return { window, events, replacements };
}

test("direct Shorts links preserve timestamp and fragment", () => {
  const state = load("https://www.youtube.com/shorts/abc_123-xyz?t=12#details");
  assert.deepEqual(state.replacements, ["https://www.youtube.com/watch?t=12&v=abc_123-xyz#details"]);
});

test("feed routes go home", () => {
  for (const route of ["/shorts", "/shorts/", "/shorts?feature=share"]) {
    assert.deepEqual(load(`https://www.youtube.com${route}`).replacements, ["https://www.youtube.com/"]);
  }
});

test("regular videos, search, and channels are not redirected", () => {
  for (const route of ["/", "/watch?v=abc", "/results?search_query=shorts", "/@creator/shorts", "/shortstuff"]) {
    assert.deepEqual(load(`https://www.youtube.com${route}`).replacements, []);
  }
});

test("mobile and trailing-slash URLs work and replace existing v parameter", () => {
  assert.deepEqual(load("https://m.youtube.com/shorts/abc/?v=wrong").replacements, ["https://m.youtube.com/watch?v=abc"]);
});

test("in-page navigation and browser history are handled", () => {
  for (const name of ["yt-navigate-finish", "yt-page-data-updated", "popstate"]) {
    const state = load("https://www.youtube.com/");
    state.window.location.href = "https://www.youtube.com/shorts/abc";
    state.events[name]();
    assert.deepEqual(state.replacements, ["https://www.youtube.com/watch?v=abc"]);
  }
});
