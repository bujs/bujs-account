'use strict'

const account = require('../lib')

/* eslint-env jest */
test('account.generate()', () => {
  expect(account.generate()).toHaveProperty('privateKey')
  expect(account.generate()).toHaveProperty('publicKey')
  expect(account.generate()).toHaveProperty('address')
})

test('account.isPrivate()', () => {
  const privateKey = account.generate().privateKey
  let badPrivateKey = ''
  expect(account.isPrivateKey(privateKey)).toBeTruthy()
  expect(account.isPrivateKey(badPrivateKey)).toBeFalsy()
  badPrivateKey = null
  expect(account.isPrivateKey(badPrivateKey)).toBeFalsy()
  badPrivateKey = undefined
  expect(account.isPrivateKey(badPrivateKey)).toBeFalsy()
  badPrivateKey = ''
  expect(account.isPrivateKey(badPrivateKey)).toBeFalsy()
  badPrivateKey = 0
  expect(account.isPrivateKey(badPrivateKey)).toBeFalsy()
  badPrivateKey = 123
  expect(account.isPrivateKey(badPrivateKey)).toBeFalsy()
})

test('account.isPublic()', () => {
  const publicKey = account.generate().publicKey
  let badPublicKey = ''
  expect(account.isPublicKey(publicKey)).toBeTruthy()
  expect(account.isPublicKey(badPublicKey)).toBeFalsy()
  badPublicKey = null
  expect(account.isPublicKey(badPublicKey)).toBeFalsy()
  badPublicKey = undefined
  expect(account.isPublicKey(badPublicKey)).toBeFalsy()
  badPublicKey = 0
  expect(account.isPublicKey(badPublicKey)).toBeFalsy()
  badPublicKey = 123
  expect(account.isPublicKey(badPublicKey)).toBeFalsy()
})

test('account.isAddress()', () => {
  const address = account.generate().address
  let badAddress = ''
  expect(account.isAddress(address)).toBeTruthy()
  expect(account.isAddress(badAddress)).toBeFalsy()
  badAddress = null
  expect(account.isAddress(badAddress)).toBeFalsy()
  badAddress = undefined
  expect(account.isAddress(badAddress)).toBeFalsy()
  badAddress = 0
  expect(account.isAddress(badAddress)).toBeFalsy()
  badAddress = 123
  expect(account.isAddress(badAddress)).toBeFalsy()
  badAddress = []
  expect(account.isAddress(badAddress)).toBeFalsy()
})

test('account.privateToAccount()', () => {
  const oldAccount = account.generate()
  const privateKey = oldAccount.privateKey
  const newAccount = account.privateToAccount(privateKey)
  expect(newAccount).toEqual(oldAccount)
  let badPrivateKey = null
  expect(() => {
    account.privateToAccount(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = undefined
  expect(() => {
    account.privateToAccount(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = ''
  expect(() => {
    account.privateToAccount(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = 123
  expect(() => {
    account.privateToAccount(badPrivateKey)
  }).toThrow('invalid privateKey')
})

test('account.privateToPublic()', () => {
  const info = account.generate()
  const privateKey = info.privateKey
  const publicKey = info.publicKey
  expect(account.privateToPublic(privateKey)).toBe(publicKey)

  let badPrivateKey = null
  expect(() => {
    account.privateToPublic(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = undefined
  expect(() => {
    account.privateToPublic(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = ''
  expect(() => {
    account.privateToPublic(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = 123
  expect(() => {
    account.privateToPublic(badPrivateKey)
  }).toThrow('invalid privateKey')
})

test('account.publicToAddress()', () => {
  const info = account.generate()
  const publicKey = info.publicKey
  const address = info.address
  expect(account.publicToAddress(publicKey)).toBe(address)

  let badPublicKey = null
  expect(() => {
    account.publicToAddress(badPublicKey)
  }).toThrow('invalid publicKey')

  badPublicKey = undefined
  expect(() => {
    account.publicToAddress(badPublicKey)
  }).toThrow('invalid publicKey')

  badPublicKey = ''
  expect(() => {
    account.publicToAddress(badPublicKey)
  }).toThrow('invalid publicKey')

  badPublicKey = 123
  expect(() => {
    account.publicToAddress(badPublicKey)
  }).toThrow('invalid publicKey')
})

test('account.parsePrivateKey()', () => {
  const privateKey = account.generate().privateKey
  const info = account.parsePrivateKey(privateKey)
  expect(Array.isArray(info)).toBeTruthy()
  expect(info.length).toBe(32)

  let badPrivateKey = null
  expect(() => {
    account.parsePrivateKey(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = undefined
  expect(() => {
    account.parsePrivateKey(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = ''
  expect(() => {
    account.parsePrivateKey(badPrivateKey)
  }).toThrow('invalid privateKey')

  badPrivateKey = 123
  expect(() => {
    account.parsePrivateKey(badPrivateKey)
  }).toThrow('invalid privateKey')
})

test('account.parsePublicKey()', () => {
  const publicKey = account.generate().publicKey
  const info = account.parsePublicKey(publicKey)
  expect(Array.isArray(info)).toBeTruthy()
  expect(info.length).toBe(32)

  let badPublicKey = null
  expect(() => {
    account.parsePublicKey(badPublicKey)
  }).toThrow('invalid publicKey')

  badPublicKey = undefined
  expect(() => {
    account.parsePublicKey(badPublicKey)
  }).toThrow('invalid publicKey')

  badPublicKey = ''
  expect(() => {
    account.parsePublicKey(badPublicKey)
  }).toThrow('invalid publicKey')

  badPublicKey = 123
  expect(() => {
    account.parsePublicKey(badPublicKey)
  }).toThrow('invalid publicKey')
})
