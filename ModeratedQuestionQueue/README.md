# Moderated question queue

A self-contained StreamElements custom widget for a host-led Q&A segment. Viewers submit a question beginning with `?` (configurable). The host uses **Show next question** in the widget field controls to display one pending question. **Clear all questions** discards the current question, pending questions and bounded duplicate/moderation history.

This is a local-only queue/display companion, not a Kasamila renderer integration, chatbot, speech service, or authenticated event bridge. It makes no network requests, reads no account credentials and starts no billable sessions. It does not require a Kasamila account. It is contributed by Kasamila for ordinary human-hosted or separately operated avatar-assisted Q&A workflows; it does not feed questions to an avatar automatically.

## Setup

Create a custom widget in the StreamElements overlay editor. Copy the four matching files to its HTML, JS, CSS and Fields tabs. Save and use the editor's existing chat event facilities to test with synthetic questions before using a live channel. Do not add secrets to Fields. Set the browser-source dimensions large enough for your longest question. This implementation does not display emotes or badges as HTML.

The host's Next/Clear controls operate through documented `widget-button` events, not chat commands. The widget has no public remote control endpoint. Events dispatched by scripts inside the widget page are trusted as part of the host environment; these controls are not an authentication mechanism. We have not verified editor-to-production-overlay button propagation; do not assume the editor control acts on a separately loaded live browser source without testing that behavior first.

## Moderation and bounds

- `delete-message` removes the matching pending or displayed question.
- `delete-messages` removes known questions from the matching user; this is not a permanent ban.
- Deleted questions leave bounded tombstones so ordinary chat cannot immediately replay them. Cache entries can eventually be evicted.
- Pending messages are capped at 50; excess messages are dropped, not persisted.
- Message text is 2–500 characters, display names at most 200, message/user IDs at most 256. Prefix length is 1–20.
- Names and questions use `textContent`, never HTML insertion. Newlines are preserved and long text wraps.
- There is no storage. Reload, widget-load or Clear resets state. Different overlay instances have independent queues.
- Removing text cannot undo speech or answers already produced by a human or a separate system.

## Verification status

Run the included offline tests from the repository root with `node --test ModeratedQuestionQueue/widget.test.cjs` (Node.js 18 or later). The test file is not copied into the overlay editor.

Thirteen local Node VM tests cover widget event handling, deduplication, active/pending deletion, bounds, text-only rendering, load/reset, and host buttons. Fifteen existing queue-contract tests covered the queue component on 2026-10-23. Neither set proves StreamElements editor/browser-source behavior. No real account, stream, viewer messages, API calls, provider E2E, or billing was used.

Before production use, validate the Fields controls in the intended overlay instance, duplicates, moderation, overflow, long text, reload and multiple browser sources in the official editor/browser-source environment. Do not claim native avatar support or platform certification.

## Provenance and license

New code authored for this contribution using the documented event contract, not copied from third-party community widgets. The included Apache-2.0 license applies to this directory. The upstream repository has no root license in the inspected tree; acceptance of this explicit per-widget license is a maintainer decision. No license is inferred for other widgets.

Sources checked 2026-10-24:
- https://github.com/StreamElements/widgets/blob/master/README.md
- https://github.com/StreamElements/widgets/blob/master/docs/CustomWidgetEvents.md
