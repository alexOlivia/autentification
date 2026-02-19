import { randomInt } from 'node:crypto';
import { VERIFICATION_CODE_LENGTH } from './constants.js';

export function generateVerificationCode(): string {
  const min = Math.pow(10, VERIFICATION_CODE_LENGTH - 1);
  const max = Math.pow(10, VERIFICATION_CODE_LENGTH) - 1;
  return randomInt(min, max + 1).toString();
}
