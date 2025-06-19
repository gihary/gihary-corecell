# gihary-corecell
Cellula primaria di Gihary IA – un sistema modulare e auto-evolutivo basato su Gemini AI e Firestore.

## Debugger

The `src/debugger.js` module now provides advanced logging utilities. Call
`setupDebugger({ verbose: true })` to enable console output and use
`logState`, `logError` and `captureVar` to record information to `debug.log`.

## Persistence and Rollback

`saveToCore` stores data in Firestore and now creates timestamped backups under
`core/{userId}/entries`. Use `rollbackMemory(userId, timestamp)` to restore the
entry closest to a given moment in time. Hooks for future diff/compare features
are included in `rollback.js`.
