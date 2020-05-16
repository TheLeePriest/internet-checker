# Internet Checker

I got sick of my Sky broadband connection dropping, so I created this little script. The script pings a URL to check if the internet connection is active. If the connection is not active Puppeteer is run to visit another url. For Sky there is a self-check URL you can use to fix your connection, this URL is passed in via a .env file.

The Puppeteer browser visits the Sky fix URL then returns the value to the script. The script runs on an interval that can also be configured in the .env file.

## Setup

Clone the repo and then install the dependencies using: 

```javascript
npm install
```
or
```javascript
yarn install
```

Add a `.env` file to the root and include the following variables:

| Name         |  Type    |
| -------------| :------: |
| LINK         |  string  |
| HOSTLINK     |  string  |
| INTERVAL     |  int     |
| RESPONSELINK |  string  |

## Usage

Run the script by using either of the following:

```javascript
npm start
```
or
```javascript
yarn start
```

The project uses `nodemon` to re-run itself in case of error.

