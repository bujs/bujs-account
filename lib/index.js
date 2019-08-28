'use strict'

const nacl = require('./vendor/nacl')
const sjcl = require('./vendor/sjcl')

/**
* Get sha256 hash string
*
* @param {String} bytes
* @returns {String}
* @private
*/
function _sha256 (bytes) {
  return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(bytes)))
}

/**
 * Create privateKey
 *
 * @param {Array} rawPrivateKey
 * @returns {String} output BU privateKey
 * @private
 */
function _createPrivateKey (rawPrivateKey) {
  const prefix = [0xda, 0x37, 0x9f]
  const version = [0x1]
  const fill = [0x00]
  const head = sjcl.bitArray.concat(prefix, version)
  let mix = sjcl.bitArray.concat(head, rawPrivateKey)
  mix = sjcl.bitArray.concat(mix, fill)
  const checksum = _sha256(_sha256(mix)).slice(0, 4)
  let privateKey = sjcl.bitArray.concat(mix, checksum)
  return sjcl.codec.base58.encode(privateKey)
}

/**
 * Create publicKey
 *
 * @param {Array} rawPublicKey
 * @returns {String} output BU publicKey
 * @private
 */
function _createPublicKey (rawPublicKey) {
  const prefix = [0xb0]
  const version = [0x1]
  const head = sjcl.bitArray.concat(prefix, version)
  const mix = sjcl.bitArray.concat(head, rawPublicKey)
  const checksum = _sha256(_sha256(mix)).slice(0, 4)
  let publicKey = sjcl.bitArray.concat(mix, checksum)
  return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(publicKey))
}

/**
 * Create address
 *
 * @param {Array} rawPublicKey
 * @returns {String} output BU address
 * @private
 */
function _createAddress (rawPublicKey) {
  const prefix = [0x01, 0x56]
  const version = [0x1]
  const head = sjcl.bitArray.concat(prefix, version)
  let mix = _sha256(rawPublicKey).slice(12)
  mix = sjcl.bitArray.concat(head, mix)
  const checksum = _sha256(_sha256(mix)).slice(0, 4)
  let address = sjcl.bitArray.concat(mix, checksum)
  return sjcl.codec.base58.encode(address)
}

/**
 * Parse privateKey, get rawPrivateKey
 *
 * @param {String} privateKey
 * @returns {String} rawPrivateKey
 * @public
 */
function parsePrivateKey (privateKey) {
  if (!isPrivateKey(privateKey)) throw new Error('invalid privateKey')
  const decodedKey = sjcl.codec.base58.decode(privateKey)
  return decodedKey.slice(4, decodedKey.length - 5)
}

/**
 * Parse publicKey, get rawPublicKey
 *
 * @param {String} publicKey
 * @returns {String} rawPublicKey
 * @public
 */
function parsePublicKey (publicKey) {
  if (!isPublicKey(publicKey)) throw new Error('invalid publicKey')

  const keyBytes = sjcl.codec.bytes.fromBits(
    sjcl.codec.hex.toBits(publicKey)
  )
  return keyBytes.slice(2, keyBytes.length - 4)
}

/**
 * Create a single BU account, include privateKey publicKey and address
 *
 * @returns {Object}
 * @public
 */
function generate () {
  const srcKeyPair = nacl.sign.keyPair()
  const seed = srcKeyPair.publicKey
  const keyPair = nacl.sign.keyPair.fromSeed(seed)
  const rawPrivateKey = Array.from(seed)
  const rawPublicKey = Array.from(keyPair.publicKey)

  // create privateKey
  const privateKey = _createPrivateKey(rawPrivateKey)
  // create publicKey
  const publicKey = _createPublicKey(rawPublicKey)
  // create address
  const address = _createAddress(rawPublicKey)

  return {
    privateKey,
    publicKey,
    address
  }
}

/**
 * Returns an BU account address, private and public key
 *
 * @param {String} privateKey
 * @public
 */
function privateToAccount (privateKey) {
  if (!isPrivateKey(privateKey)) throw new Error('invalid privateKey')
  const publicKey = privateToPublic(privateKey)
  const address = publicToAddress(publicKey)
  return {
    privateKey,
    publicKey,
    address
  }
}

/**
 * Returns the BU publicKey
 *
 * @param {String} privateKey
 * @returns {String} publicKey
 * @public
 */
function privateToPublic (privateKey) {
  if (!isPrivateKey(privateKey)) throw new Error('invalid privateKey')

  const rawPrivateKey = parsePrivateKey(privateKey)
  const keyPair = nacl.sign.keyPair.fromSeed(rawPrivateKey)
  const rawPublicKey = Array.from(keyPair.publicKey)
  return _createPublicKey(rawPublicKey)
}

/**
 * Returns the BU address
 *
 * @param {String} publicKey
 * @returns {String}
 * @public
 */
function publicToAddress (publicKey) {
  if (!isPublicKey(publicKey)) throw new Error('invalid publicKey')
  const rawPublicKey = parsePublicKey(publicKey)
  return _createAddress(rawPublicKey)
}

/**
 * Checks if a given string is a valid BU privateKey
 *
 * @param {String} key
 * @returns {Boolean}
 * @public
 */
function isPrivateKey (key) {
  try {
    if (!key || (typeof key !== 'string')) {
      return false
    }

    const decodedKey = sjcl.codec.base58.decode(key.trim())

    if (
      decodedKey[0] !== 0xda ||
      decodedKey[1] !== 0x37 ||
      decodedKey[2] !== 0x9f ||
      decodedKey[3] > 4 ||
      decodedKey[3] < 1
    ) {
      return false
    }

    const length = decodedKey.length

    if (decodedKey[length - 5] !== 0x00) {
      return false
    }

    const mix = decodedKey.slice(0, length - 4)
    const originalChecksum = decodedKey.slice(length - 4, length)
    const checksum = _sha256(_sha256(mix)).slice(0, 4)

    return (originalChecksum.join() === checksum.join())
  } catch (err) {
    return false
  }
}

/**
 * Checks if a given string is a valid BU publicKey
 *
 * @param {String} key
 * @returns {Boolean}
 * @public
 */
function isPublicKey (key) {
  try {
    if (!key || typeof key !== 'string') {
      return false
    }

    const keyBytes = sjcl.codec.bytes.fromBits(
      sjcl.codec.hex.toBits(key.trim())
    )

    if (
      keyBytes[0] !== 0xb0 ||
      keyBytes[1] > 4 ||
      keyBytes[1] < 1
    ) {
      return false
    }

    const length = keyBytes.length

    const mix = keyBytes.slice(0, length - 4)
    const originalChecksum = keyBytes.slice(length - 4, length)
    const checksum = _sha256(_sha256(mix)).slice(0, 4)

    return (originalChecksum.join() === checksum.join())
  } catch (err) {
    return false
  }
}

/**
 * Checks if a given string is a valid BU address
 *
 * @param {String} address
 * @returns {Boolean}
 * @public
 */
function isAddress (address) {
  try {
    if (!address || typeof address !== 'string') {
      return false
    }

    const decodedAddress = sjcl.codec.base58.decode(address.trim())

    if (
      decodedAddress[0] !== 0x01 ||
      decodedAddress[1] !== 0x56 ||
      decodedAddress[2] !== 0x1
    ) {
      return false
    }

    const length = decodedAddress.length
    const mix = decodedAddress.slice(0, length - 4)
    const originalChecksum = decodedAddress.slice(length - 4, length)
    const checksum = _sha256(_sha256(mix)).slice(0, 4)

    return (originalChecksum.join() === checksum.join())
  } catch (err) {
    return false
  }
}

module.exports = {
  generate,
  privateToAccount,
  privateToPublic,
  publicToAddress,
  parsePrivateKey,
  parsePublicKey,
  isPrivateKey,
  isPublicKey,
  isAddress
}
