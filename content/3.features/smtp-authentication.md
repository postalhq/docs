---
title: SMTP Authentication
description: ''
category: Features
---

For sending outgoing emails through the Postal SMTP server you will need to generate a <b>credential</b> through the Postal web interface. This credential is associated with a server and allows you to send mail from any domain associated with that domain (or the organization that owns the domain.)

## Authentication types

When authenticating to the SMTP server, there are three supported authentication types.

* `PLAIN` - the credentials are passed in plain text to the server. When using this, you can provide any string as the username (e.g. `x`) and the password should contain your credential string.
* `LOGIN` - the credentials are passed Base64-encoded to the server. As above, you can use anything as the username and the password should contain the credential string (Base64-encoded). Check the example below:
  ```
  # Example snippet:
  # Let's assume, you use "$ telnet <smtp_server_ip_address> 25"
  Trying <smtp_server_ip_address>
  Connected to <smtp_server_ip_address>
  Escape character is '^]'.
  220 postal.example.com ESMTP Postal/GWLMYC7F

  # You start from here:
  HELO example.com
  250 postal.example.com
  AUTH LOGIN
  334 VXNlcm5hbWU6
  c29tLXNtdHAtdXNlcg==             >> you would need to enter any or your smtp username in base64 - try command - "echo -n 'your-username' | base64"
  334 UGFzc3dvcmQ6
  OElLM0Q4ckFOQW9obTl0QnpQcVpkRlhi >> you would need to enter your smtp key generated in the web UI in base64 - try command - "echo -n '8IK3D8rXXNAohm9tBzPqZdFXb' | base64"
  235 Granted for <organization-name>/<mail-server>
  ```
* `CRAM-MD5` - this is a challenge-response mechanism based on the HMAC-MD5 algorithm. Unlike the above two mechanism, the username does matter and should contain the organization and server permalinks separated by a `/` or `_` character. The password used should be the value from your credential.

To get the `Credentials`, you can go to the Postal home > Credentials > Click or Add a Credential > Copy the username and the generated key.

![smtp_credentials](https://github.com/user-attachments/assets/be0bf380-b369-49d8-83b5-e824561e0c15)


## From/Sender validation

When sending outgoing email through the SMTP server, it is important that the `From` header contains a domain that is owned by the server or its organization. If this it not valid, you will receive a `530 From/Sender name is not valid` error.

If you have enabled "Allow Sender Header" for the server, you can include this domain in the `Sender` header instead and any value you wish in the `From` header.

## IP-based authentication

Postal has the option to authenticate clients based on their IP address. To use this, you need to create an **SMTP-IP** credential for the IP or network you wish to allow to send mail. Use this carefully to avoid creating an open relay.
