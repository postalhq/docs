---
title: Our container image
description: ''
position: 5.2
category: 'Other Notes'
---

This page contains information about how Postal actually is packaged and run within a container.

## Where's the container?

Postal is packaged and hosted at `ghcr.io/postalserver/postal`.

The `latest` tag will always track the `main` branch within the repository and therefore will have the latest copy of the application. It is not recommended to use this tag in production because you may start using it at any time without noticing.

Each version of Postal will also be tagged, for example, `2.0.0`. We always recommend using a version tag in production. To upgrade, you simply need to start using the newer version of the container and be sure to run the `upgrade` command. You can view all the tags which exist [on GitHub](https://github.com/postalserver/postal/pkgs/container/postal) and in [our CHANGELOG](https://github.com/postalserver/postal/blob/main/CHANGELOG.md).

## What processes need to run?

There are 5 processes that need to be running for a successful Postal installation. All processes are run within the same image (`ghcr.io/postalserver/postal`). The table below identifies the processes.

### The web server

* **Command:** `postal web-server`
* **Ports:** 5000

This is the main web server that handles all web traffic for Postal's admin interface and open/click tracking requests. By default, it listens on port 5000 but this can be configured in the `postal.yml` file by changing the `web_server.port` option.

You can run multiple web servers and load balance between them to add additional capacity for web requests.

### The SMTP server

* **Command:** `postal smtp-server`
* **Ports:** 25
* **Capabilities required:** `NET_BIND_SERVICE`

This is the main SMTP server for receiving messages from clients and other MTAs. As with the web server, you can configure this to run on any port by changing the `smtp_server.port` option in the `postal.yml` config file.

You can run multiple SMTP servers and load balance between them to add additional capacity for SMTP connections.

### The worker(s)

* **Command:** `postal worker`

This runs a worker which will receive jobs from the message queue. Essentially, this handles processing all incoming and outgoing e-mail. If you're needing to process lots of e-mails, you may wish to run more than one of these. You can run as many of these as you wish.

### The cron

* **Command:** `postal cron`

**There must only be one of these running.** It will automatically create jobs at appropriate times in order to handle scheduled actions. Running more of these will not increase the capacity of your system. Running none of them will cause many problems.

### The message re-queuer

* **Command:** `postal requeuer`

**There must only be one of these running.**  This process monitors the queues and ensures that messages that need to be retried are re-added to the message queue at the appropriate times. Like the cron, do not run more than one of these processes.

<alert type="warning">
Be sure to configure your system to only allow a single <code>cron</code> and <code>requeuer</code> process to be running at the same time.
</alert>

## Configuration

The image exists all configuration to be mounted at `/config`. At a minimum, this directory must contain a `postal.yml` and a `signing.key`. You can see an example `postal.yml` in the [installation tool repository](https://github.com/postalserver/install/blob/main/examples/postal.yml).

The `signing.key` can be generated using the following command:

```
openssl genrsa -out path/to/signing.key 2018
```

## Networking

If you wish to utilise IP pools, you will need to run Postal using host networking. This is because Postal will need to be able to determine which physical IPs are available to it and be able to send and receiving traffic on those IPs.

If you are not using IP pools, there is no need to use host networking and you can expose the ports listed above as appropriate.

## Waiting for services

The container's entrypoint supports waiting for external services to be ready before starting the underlying process. To use this you need to set the `WAIT_FOR_TARGETS` environment variable with a list of services and ports. For example, `mariadb:3306`, replacing `mariadb` with the hostname or IP of your MariaDB server. You can specify multiple endpoint by separating them with a space.

The default maximum time to wait is 30 seconds, you can override this using the `WAIT_FOR_TIMEOUT` environment variable.
