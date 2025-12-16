const crypto = require("crypto");

// Generate a 64-byte (512-bit) random string
// 32 bytes (256 bits) is often the minimum recommended, 64 is more secure.
const secret = crypto.randomBytes(64).toString("base64");

console.log("Generated JWT Secret (Base64):");
console.log(secret);
// Example output: C32k9h+v8sRj/9zG2wLhY9K1mP5oP5h7T3Z9sHw1bT4xO6l8Q7mX4yV4fW4zBw0jQ3g7fW5vF1q9a2n4xY=
