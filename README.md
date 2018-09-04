# rmarques.io
Personal work experience and skills

## deployment

### install node

```bash
$ wget https://nodejs.org/dist/v8.11.1/node-v8.11.1-linux-armv6l.tar.xz
$ tar -xvf node-v8.11.1-linux-armv6l.tar.xz
$ cp -R node-v8.11.1-linux-armv6l/* /usr/local/
$ rm -r node-v8.*
```

### clone repo

```bash
$ git clone https://github.com/ras-marques/rmarques.io.git
```

### install dependencies

```bash
$ cd rmarques.io
$ npm install
```

### run server

```bash
$ npm start
```