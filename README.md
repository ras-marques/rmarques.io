# rmarques.io
Personal work experience and skills

## deployment

### configure ddclient to update the IP automatically on namecheap

Currently the server is on a raspberry at home and its external IP is dynamic. In this case, the domain target has to be
updated each time the IP changes. We do this using a program called `ddclient`.

Install `ddclient`

```bash
$ sudo apt-get update
$ sudo apt-get install ddclient
```

During the installation just skip everything, or enter whatever is needed to proceed, the configuration will be done
manually afterwards.

Next open `/etc/ddclient.conf` and enter the following text:

```bash
use=web, web=dynamicdns.park-your-domain.com/getip
protocol=namecheap
server=dynamicdns.park-your-domain.com
login=rmarques.io
password=CHECK_THIS_ON_THE_NAMECHEAP_WEBSITE_LONG_SERIES_OF_CHARACTERS
@
```

To test this configuration run:

```bash
$ sudo ddclient -daemon=0 -debug -verbose -noquiet -force
```

If ok, the last line should be something like:

```bash
SUCCESS:  updating @: good: IP address set to xxx.xxx.xxx.xxx
```

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

HTTP Requests come on port 80 and HTTPS on port 443. We have an http server running on port 3080 whose sole purpose is
to redirect traffic to the proper https server, which is running on port 3443, so some rules have to be added to the
firewall. Requests on port 80 will be forwarded to port 3080 and requests on port 443 will be forwarded to port 3443.
Since we are running the server on raspbian at the moment, the fastest way I could find was add rules to iptables each
time the Raspberry reboots. This is of course done automatically, by adding the following lines to the end of
`/etc/rc.local`, just before `exit 0`.

```bash
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3080
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3443
```

### add the ssl certificate, key and ca-bundle

The certificate and ca-bundle can be obtained from namecheap, but the private key had to be stored in my GDrive.

The three files have to be placed inside a folder called `ssl` at the root of the repository. This is the present folder
structure:

```bash
/home/pi/rmarques.io/ssl/ca-bundle.pem
/home/pi/rmarques.io/ssl/rmarques_io_key.pem
/home/pi/rmarques.io/ssl/rmarques_io_crt.pem
```

### start the server at boot

Make a file on `/etc/systemd/system/` and give it the right permissions

```bash
sudo touch /etc/systemd/system/startrmarquesio.service
sudo chmod u+x /etc/systemd/system/startrmarquesio.service
sudo chmod g+x /etc/systemd/system/startrmarquesio.service
```

Fill it with the good stuff

```bash
[Service]
WorkingDirectory=/home/pi/rmarques.io
ExecStart=/usr/local/bin/npm start
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=rmarques.io
User=root
Group=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Now enable it on boot with:

```bash
sudo systemctl enable startrmarquesio.service
```

If you ever want to disable it:

```bash
sudo systemctl disable startrmarquesio.service
```

Just to test, you can start the service with

```bash
sudo systemctl start startrmarquesio.service
```

and stop it with

```bash
sudo systemctl stop startrmarquesio.service
```

### run server

When developing the backend, you will need to start npm (and kill it with CTRL+C) periodically.

```bash
$ npm start
```