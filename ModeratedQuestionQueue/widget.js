"use strict";

// Preparation only: normalize documented StreamElements events without network I/O.
// Never pass onWidgetLoad payloads here: they may contain account credentials.
function createStreamElementsInput({ maxPending = 100, maxSeen = 5000 } = {}) {
  for (const [name, value] of Object.entries({ maxPending, maxSeen })) {
    if (!Number.isInteger(value) || value < 1 || value > 5000) {
      throw new RangeError(`${name} must be an integer from 1 to 5000`);
    }
  }
  const seen = new Set();
  const moderated = new Set();
  // Hold at least one full pending batch of moderation tombstones.
  const maxModerated = Math.max(maxSeen, maxPending);
  let pending = [];
  let closed = false;
  const id = (value) => typeof value === "string" && value.length > 0 && value.length <= 256;
  const remember = (value) => {
    seen.add(value);
    while (seen.size > maxSeen) seen.delete(seen.values().next().value);
  };
  const suppress = (value) => {
    moderated.delete(value);
    moderated.add(value);
    while (moderated.size > maxModerated) moderated.delete(moderated.values().next().value);
  };
  return {
    accept(detail) {
      if (closed || !detail || typeof detail !== "object") return "ignored";
      const event = detail.event;
      if (!event || typeof event !== "object") return "ignored";
      if (detail.listener === "delete-message") {
        if (!id(event.msgId)) return "ignored";
        suppress(event.msgId); // Suppress replay while the bounded tombstone remains.
        pending = pending.filter((item) => item.id !== event.msgId);
        return "removed";
      }
      if (detail.listener === "delete-messages") {
        if (!id(event.userId)) return "ignored";
        // This removes known pending messages, not future messages by this viewer.
        pending = pending.filter((item) => {
          if (item.user_id !== event.userId) return true;
          suppress(item.id);
          return false;
        });
        return "removed";
      }
      if (detail.listener !== "message") return "ignored";
      const data = event.data;
      if (!data || !id(data.msgId) || !id(data.userId)
          || typeof data.text !== "string" || data.text.length < 2 || data.text.length > 500
          || typeof data.displayName !== "string" || data.displayName.length > 200) return "ignored";
      if (seen.has(data.msgId) || moderated.has(data.msgId)
          || pending.some((item) => item.id === data.msgId)) return "duplicate";
      // Remember overflow IDs too; replay is suppressed while the bounded ID remains.
      remember(data.msgId);
      if (pending.length >= maxPending) return "full";
      pending.push(Object.freeze({
        id: data.msgId,
        user_id: data.userId,
        name: data.displayName,
        mention: typeof data.nick === "string" ? data.nick.slice(0, 200) : data.displayName,
        text: data.text,
        emote_only: data.tags?.["emote-only"] === "1"
      }));
      return "queued";
    },
    take() { return closed ? null : (pending.shift() || null); },
    get size() { return pending.length; },
    close() { closed = true; pending = []; seen.clear(); moderated.clear(); }
  };
}



// No network, external scripts, storage, or account credentials are used.
(function attachQuestionQueue() {
  if (typeof window === "undefined") return;
  let queue = createStreamElementsInput({ maxPending: 50 });
  let current = null;
  let prefix = "?";
  const name = document.getElementById("question-name");
  const body = document.getElementById("question-text");
  const count = document.getElementById("question-count");
  function render() {
    name.textContent = current ? current.name : "Question queue";
    body.textContent = current ? current.text : "Waiting for the host to select a question";
    count.textContent = String(queue.size) + " waiting";
  }
  function clear() { queue.close(); queue = createStreamElementsInput({ maxPending: 50 }); current = null; }
  window.addEventListener("onWidgetLoad", (obj) => {
    // Read only fieldData. Never read channel, session, or apiToken.
    const candidate = obj?.detail?.fieldData?.questionPrefix;
    prefix = typeof candidate === "string" && candidate.length >= 1 && candidate.length <= 20 ? candidate : "?";
    clear(); render();
  });
  window.addEventListener("onEventReceived", (obj) => {
    const detail = obj?.detail;
    const event = detail?.event;
    if (!event) return;
    if (event.listener === "widget-button" || detail.listener === "widget-button") {
      if (event.field === "nextQuestion" && event.value === "Next question") current = queue.take();
      else if (event.field === "clearQueue" && event.value === "Clear queue") clear();
      else return;
      render(); return;
    }
    if (detail.listener === "message") {
      const text = event.data?.text;
      if (current && event.data?.msgId === current.id) return;
      if (typeof text !== "string" || !text.startsWith(prefix) || !text.slice(prefix.length).trim()) return;
      // Preserve the original detail; only pass an allowlisted normalized shape onward.
      queue.accept(detail);
    } else if (detail.listener === "delete-message" || detail.listener === "delete-messages") {
      queue.accept(detail);
      if (current && detail.listener === "delete-messages" && current.user_id === event.userId) {
        queue.accept({ listener: "delete-message", event: { msgId: current.id } });
      }
      if (current && ((detail.listener === "delete-message" && current.id === event.msgId)
          || (detail.listener === "delete-messages" && current.user_id === event.userId))) current = null;
    } else return;
    render();
  });
  render();
})();
