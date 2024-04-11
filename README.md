<center>

<img src="./docs/logo.svg" width="300"/>

</center>

# Whatsapp Bulk Messenger

> Send your message to multiple Whatsapp contacts in ONE SHOT!

## Usage

You can check it online now! Give it a try at:

- https://bulk-messager.onrender.com

## Build & Serve

To build and serve your own instance of Whatsapp Bulk Messenger, you can just run the file `serve.sh`, in some hosting the npm install will be done automatically, but if you are running on docker or your own machine you will need to install the dependencies first.

```bash
# Go to frontend folder and install dependencies
cd ./frontend
npm install

# Go back and enter backend folder to install the dependencies too
cd ..
cd ./backend
npm install

# Go back and run the serve script
cd ..
./serve.sh
```

> [!WARNING]
> If you copy/paste to ZSH, it may argue about "#" being a "bad pattern", just remove the comments and run again.

It will build the frontend folder inside the backend to be served, and then will start the server using `ts-node` on the port 3000

- http://localhost:3000

## Development

For development is the same thing as the build, but instead of running the `serve.sh` script, you will need to run the `dev.sh` script.

```bash
# Go to frontend folder and install dependencies
cd ./frontend
npm install

# Go back and enter backend folder to install the dependencies too
cd ..
cd ./backend
npm install

# Go back and run the dev script
cd ..
./dev.sh
```

I will run the backend behind nodemon at the port 3000, together with the websocket on the `ws` protocol.
And the frontend will be served at the port 5173.
http://localhost:3000
ws://localhost:3000
http://localhost:5173

## Contribute

Feel free to open an issue or send a pull request!
