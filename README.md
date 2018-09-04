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

### add a forwarding rule to the firewall

Requests come on port 80 but the server is running on port 3000, so a rule has to be added to the firewall.
Since we are running the server on raspbian at the moment, the fastest way I could find was add a rule to iptables each
time the Raspberry reboots. This is of course done automatically, by adding the following line to the end of
`/etc/rc.local`, just before `exit 0`.

```bash
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```

### run server

When developing the backend, I will need to start npm (and kill it with CTRL+C) periodically.

```bash
$ npm start
```