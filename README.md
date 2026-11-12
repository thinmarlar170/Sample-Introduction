# Sample-Introduction
My sample Introduction

## Run

Requires Node.js. Start the server with:

```sh
node server.js
```

Then open http://localhost:3000. Messages are accepted with `POST /messages` and kept in server memory only; they are cleared when the server stops.

Open the message board from the introduction page to launch it in a new tab. It starts with three introduction messages, and new messages are appended below them. The board is available at http://localhost:3000/board; its messages are also available through `GET /messages`.
