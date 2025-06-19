# gihary-corecell
Cellula primaria di Gihary IA – un sistema modulare e auto-evolutivo basato su Gemini AI e Firestore.

## Debugger

The `src/debugger.js` module now provides advanced logging utilities. Call
`setupDebugger({ verbose: true })` to enable console output and use
`logState`, `logError` and `captureVar` to record information to `debug.log`.

## Ranker

The ranking system in `src/ranker.js` computes a score from 1 to 10 by
weighing relevance, novelty, personal context and future applicability. The
exported `trainRankingModel` function is a placeholder for future training
of these weights.
