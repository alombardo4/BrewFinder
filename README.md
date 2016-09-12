# BrewFinder
BrewFinder is a MEAN stack app that allows users to record sightings of specific beers at their favorite stores. It integrates with BreweryDB.org for beer and brewery information, Google Maps Places for store location information, Google, Facebook, and Twitter for OAuth login, and has a rich web app experience for mobile devices. The client application is fully responsive, and a full JSON API exists.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Running
Development mode runs the web server on port 9000.
Production mode runs the web server on port 8888. Running production behind a reverse proxy to port 443 or 80 is highly recommended to prevent giving the NodeJS process root access. The api is available at `http(s)://SERVER_IP:PORT/api`.
