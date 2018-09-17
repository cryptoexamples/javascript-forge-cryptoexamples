---
title: Java String Encryption with key generation using "node-forge"
keywords: sample
summary: "String encryption in JavaScript with key generation"
permalink: javascript_string_encryption_key_based_symmetric.html
folder: JavaScript Forge
references: [
    # Place a list of references used to create and/or understand this example.
    {
        url: "https://github.com/digitalbazaar/forge",
        description: "node-forge"
    }
]
authors: [
    {
        name: "Tobias Hirzel",
        url: ""
    }
]
# List all reviewers that reviewed this version of the example. When the example is updated all old reviews
# must be removed from the list below and the code has to be reviewed again. The complete review process
# is documented in the main repository of CryptoExamples
current_reviews: [

]
# Indicates when this example was last updated/created. Reviews don't change this.
last_updated: "2018-09-17"
tags: [JavaScript, Node.js, node-forge, AES, GCM, Salt, AEAD] 
---

## Use cases

- Random key generation
- String encryption

## node version

- 8.11.2

## JavaScript Version

- ECMAScript 6 and higher
- In order to run this code, one hast to build it with an ECMAScript 6 compiler like Babel. see "installation".

## Installation

- [node-forge](https://github.com/digitalbazaar/forge")
- [Babel](https://babeljs.io/)
- [Winston logger](https://github.com/winstonjs/winston)

## Example Code for JavaScript String Encryption with key generation using AES-GCM

```js
{% include_relative src/allinone/forge/ExampleStringEncryptionKeyBased.java %}
```

{% include links.html %}
