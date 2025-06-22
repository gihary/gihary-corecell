# gihary-corecell
Cellula primaria di Gihary IA – un sistema modulare e auto-evolutivo basato su Gemini AI e Firestore.

## Debugger

The `src/debugger.js` module now provides advanced logging utilities. Call
`setupDebugger({ verbose: true })` to enable console output and use
`logState` and `logError` to record information to `debug.log`.

## Ingestion Endpoint

L’endpoint `POST /gihary-ingest` accetta un corpo JSON con i seguenti campi:

- `input`: il testo da elaborare  
- `type`: il tipo di sorgente (`email`, `whatsapp`, `file`, `clipboard`)  
- `userId` *(opzionale)*: identificativo dell’utente da usare per la persistenza  

La risposta conterrà `{ success: true, data }` in caso di successo, oppure `{ success: false, error }` in caso di errore.

## Persistence and Rollback

La funzione `saveToCore` salva i dati principali su Firestore e crea **backup con timestamp** nella struttura:

Inoltre, dopo ogni scrittura viene creata/aggiornata la cartella `core/{userId}/entries` e il `payload` viene salvato in `YYYY-MM-DD.json`.


È possibile ripristinare uno stato precedente con `rollbackMemory(userId, timestamp)`, che recupera l’entry più vicina nel tempo.

Il modulo `rollback.js` include anche **hook per funzionalità future di confronto versioni** (`diff/compare`).

## Ranker

Il modulo `src/ranker.js` calcola un punteggio da 1 a 10, pesando **rilevanza, novità, contesto personale e applicabilità futura**.

La funzione `trainRankingModel` valuta ora un singolo `entry` e restituisce un oggetto
con punteggio e breakdown dei quattro criteri, utilizzando pesi di default
`0.4`, `0.3`, `0.2` e `0.1`.

## Parsing examples

Le funzioni di parsing normalizzano i messaggi in un array di oggetti con i campi:
`sender`, `text`, `timestamp`, `channel` e `language`.

```javascript
import { parseWhatsappMessage } from './src/parser/whatsappParser.js';
import { parseEmail } from './src/parser/emailParser.js';

const chat = '12/03/24, 15:22 - Alice: Ciao!\n12/03/24, 15:23 - Bob: Benvenuta';
const messages = parseWhatsappMessage(chat);
// [ { sender: 'Alice', text: 'Ciao!', channel: 'whatsapp', ... }, ... ]

const mail = `From: Alice <alice@example.com>\nDate: Tue, 3 Oct 2023 10:15:00 +0200\n\nHello world`;
const emails = parseEmail(mail);
```


