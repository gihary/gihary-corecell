# gihary-corecell
Cellula primaria di Gihary IA – un sistema modulare e auto-evolutivo basato su Gemini AI e Firestore.

## Debugger

The `src/debugger.js` module now provides advanced logging utilities. Call
`setupDebugger({ verbose: true })` to enable console output and use
`logState`, `logError` and `captureVar` to record information to `debug.log`.

## Ingestion endpoint

POST `/gihary-ingest` expects a JSON body with the following fields:

- `input`: the text to ingest
- `type`: the source type (`email`, `whatsapp`, `file` or `clipboard`)
- `userId` *(optional)*: identifier used when persisting data

The response will contain `{ success: true, data }` on success or
`{ success: false, error }` if something went wrong.
