import { randomBytes } from 'crypto';

function generateSecret() {
  const mySecret = randomBytes(64).toString('hex');
  console.log(`Generated JWT Secret: ${mySecret}`);
}

generateSecret();
