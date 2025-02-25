---
title: SMTP TLS
description: ''
category: Features
---

By default, Postal's SMTP server is not TLS enabled however you can enable it by generating and providing a suitable certificate. We recommend that you use a certificate issued by a recognised certificate authority, but this isn't essential to use this feature.

## Key & certificate locations

Certificates should be placed in your `/opt/postal/config` directory.

* `/opt/postal/config/smtp.key` - the private key in PEM format
* `/opt/postal/config/smtp.cert` - the certificate in PEM format

### Generating a self signed certificate

You can use the command below to generate a self-signed certificate.

```bash
openssl req -x509 -newkey rsa:4096 -keyout /opt/postal/config/smtp.key -out /opt/postal/config/smtp.cert -sha256 -days 365 -nodes
```

### Using Caddy certificate for TLS

#### Setup automatic copying from Caddy to Postal

To remove the need of the manual mainenance task to copy the certificate from Caddy to Postal we can automate this. The original discussion and author can be found [here](https://github.com/orgs/postalserver/discussions/2673).

##### Install inotify-tools

Install the toolset which provides `inotifywait`, used to monitor certificate changes.

```bash
sudo apt-get update
sudo apt-get install inotify-tools
```

##### Create Monitoring Script

Create a script named `monitor_certs.sh`:
```bash
nano /opt/postal/monitor_certs.sh
```
Add following code to the script file:
```bash
#!/bin/bash

CERT_DIR="/opt/postal/caddy-data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/YOURDOMAIN/"
CERT_FILE="${CERT_DIR}YOURDOMAIN.crt"
KEY_FILE="${CERT_DIR}YOURDOMAIN.key"

while true; do
    inotifywait -e modify "$CERT_FILE" "$KEY_FILE"

    # Copy the certificates to Postal's configuration directory
    cp "$CERT_FILE" /opt/postal/config/smtp.cert
    cp "$KEY_FILE" /opt/postal/config/smtp.key

    # Adjust permissions to ensure Postal can read the certificates
    chmod o+r /opt/postal/config/smtp.*

    # Restart Postal to use the new certificates
    postal restart
done
```

Make the script executable:
```bash
chmod +x /opt/postal/monitor_certs.sh
```
##### Create a systemd Service

Make a systemd service file:
```bash
sudo nano /etc/systemd/system/monitor_certs.service
```
Insert the following content:
```yaml
[Unit]
Description=Monitor Caddy Certificates for Postal

[Service]
ExecStart=/opt/postal/monitor_certs.sh
Restart=always
User=your_username 
Group=your_groupname

[Install]
WantedBy=multi-user.target
```

##### Activate the Service
Reload the systemd daemons:
```bash
sudo systemctl daemon-reload
```
Enable and start the service:
```bash
sudo systemctl enable monitor_certs.service
sudo systemctl start monitor_certs.service
```
##### Initial Manual Certificate Copy
Before the monitoring script takes over, you should manually copy the certificates for the first time:
```bash
cp /opt/postal/caddy-data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/YOURDOMAIN/YOURDOMAIN.crt /opt/postal/config/smtp.cert
cp /opt/postal/caddy-data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/YOURDOMAIN/YOURDOMAIN.key /opt/postal/config/smtp.key
chmod o+r /opt/postal/config/smtp.*
```

## Configuration

Once you have a key and certificate you will need to enable TLS in the configuration file (`/opt/postal/config/postal.yml`). Additional options are available too.

```yaml
smtp_server:
  # ...
  tls_enabled: true
  # tls_certificate_path: other/path/to/cert/within/container
  # tls_private_key_path: other/path/to/cert/within/container
  # tls_ciphers:
  # ssl_version: SSLv23
```

You will need to run `postal restart` if you change the configuration or your key/certificate.
