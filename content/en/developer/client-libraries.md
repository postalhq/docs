---
title: Client Libraries
description: ''
position: 4.1
category: Developer
---

There are a number of client libraries available to help send e-mail using the Postal platform.

* [Ruby](https://github.com/postalserver/postal-ruby)
* [Rails](https://github.com/postalserver/postal-rails)
* [Ruby (mail gem)](https://github.com/postalserver/postal-mailgem)
* [PHP](https://github.com/postalserver/postal-php)
* [Node](https://github.com/postalserver/postal-node)
* [Java](https://github.com/matthewmgamble/postal-java)
* [Go](https://github.com/Pacerino/postal-go)

All of these libraries will make use of the API rather than using any SMTP protocol - this is considered to be best approach for delivering your messages.

If your framework makes use of SMTP, you do not need a client library however you will also miss out on some of Postals functionality.
