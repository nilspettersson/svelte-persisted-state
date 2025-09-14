# svelte-persisted-state
Persist reactive values to `localStorage` or `sessionStorage` and keep it in sync.

## Features
- 🔁 Auto-sync to Web Storage (or opt-in manual saves)
- 🧠 Works with any JSON-serializable value
- 🧹 `cleanup()` hook to dispose internal effect (outside tracking context)
- 🛡️ Safe read/write with optional `onError`
