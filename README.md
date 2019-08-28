## bujs-account

A simple BU account utility module.

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Install

```bash
$ npm install --save bujs-account
```



## Test

The tests can be run with Node.js 

```bash
$ npm test
```



## Usage

> Create a single BU account, include privateKey publicKey and address
```js
const generate = require('bujs-account').generate

console.log(generate())

/* result
{ privateKey: 'privbtritxkpPzRxK7KFrrzbewMavnFHMvyx5qfp4cYK6ZFcAF5heDYZ',
  publicKey: 'b00194aea1bb70e3a4784f504670f2aee5ce8d5b70debfa2d2f704361767d8baa1b730576e2b',
  address: 'buQh9Df6hWSKrttMsNR5HMzf6PiKednk6BiU' }
*/
```



>Get  BU account by privateKey

```js
const privateToAccount = require('bujs-account').privateToAccount

console.log(privateToAccount('privbtritxkpPzRxK7KFrrzbewMavnFHMvyx5qfp4cYK6ZFcAF5heDYZ'))

/* result
  { 
    privateKey: 'privbtritxkpPzRxK7KFrrzbewMavnFHMvyx5qfp4cYK6ZFcAF5heDYZ',
    publicKey: 'b00194aea1bb70e3a4784f504670f2aee5ce8d5b70debfa2d2f704361767d8baa1b730576e2b',
    address: 'buQh9Df6hWSKrttMsNR5HMzf6PiKednk6BiU' 
  }
*/
```



> Get  publicKey by privateKey

```js
const privateToPublic = require('bujs-account').privateToPublic

console.log(privateToPublic('privbtritxkpPzRxK7KFrrzbewMavnFHMvyx5qfp4cYK6ZFcAF5heDYZ'))

// result: 'b00194aea1bb70e3a4784f504670f2aee5ce8d5b70debfa2d2f704361767d8baa1b730576e2b'
```



> Get  address by publicKey

```js
const publicToAddress = require('bujs-account').publicToAddress

console.log(publicToAddress('b00194aea1bb70e3a4784f504670f2aee5ce8d5b70debfa2d2f704361767d8baa1b730576e2b'))

// result: 'buQh9Df6hWSKrttMsNR5HMzf6PiKednk6BiU'
```



> Checks if a given string is a valid BU privateKey

```js
const isPrivateKey = require('bujs-account').isPrivateKey

const privateKey = 'privbtritxkpPzRxK7KFrrzbewMavnFHMvyx5qfp4cYK6ZFcAF5heDYZ'
console.log(isPrivateKey(privateKey))
// return: true
const badPrivateKey = 'btritxkpPzRxK7KFrrzbewMavnFHMvyx5qfp4cYK6ZFcAF5heDYZpriv'
console.log(isPrivateKey(badPrivateKey))
// return: false
```



> Checks if a given string is a valid BU publicKey

```js
const isPublicKey = require('bujs-account').isPublicKey

const publicKey = 'b00194aea1bb70e3a4784f504670f2aee5ce8d5b70debfa2d2f704361767d8baa1b730576e2b'
console.log(isPublicKey(publicKey))
// return: true

const badPublicKey = 'aea1bb70e3a4784f504670f2aee5ce8d5b70debfa2d2f704361767d8baa1b730576e2bb00194'
console.log(isPublicKey(badPublicKey))
// return: false
```



> Checks if a given string is a valid BU address

```js
const isAddress = require('bujs-account').isAddress

const address = 'buQh9Df6hWSKrttMsNR5HMzf6PiKednk6BiU'
console.log(isAddress(address))
// return: true

const badAddress = 'Qh9Df6hWSKrttMsNR5HMzf6PiKednk6BiUbu'
console.log(isAddress(badAddress))
// return: false
```



