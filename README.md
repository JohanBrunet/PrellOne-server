# PrellOne-server
## Development

### Prerequisites

You might want to prefer a Unix environment (Linux or macOS) for this requires a shell, mostly for `npm`.

First check that you have `git`, `Node.js` and `npm` installed (refer to the documentation).

### Install

Download the source code.

:warning: *This step might require authentication, use your Github credentials.*

```
git clone <repository url>
```

When download is completed go to the working directory: `cd PrellOne-server`.

Install dependencies by running `npm install`.
Then install `nodemon`: `npm install -g nodemon`.

### Run
:warning: *Make sure you have MongoDB installed and a mongodb server is running.*

From there you can run the server with the following command:

```
npm run dev
```