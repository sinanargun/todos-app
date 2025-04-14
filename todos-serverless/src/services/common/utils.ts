import * as crypto from 'crypto';

const SALT_VALUE = 'your-fixed-salt-value'

export function generateHash(data: string): string {
  return crypto.pbkdf2Sync(data, SALT_VALUE, 100000, 64, 'sha512').toString('hex');
}

export function compareHash(data: string, hash: string): boolean {
  return generateHash(data) === hash;
}

export async function successResponse(statusCode: number, data: any) {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
}

export async function errorResponse(statusCode: number, error: any) {
  return {
    statusCode,
    body: JSON.stringify({ error }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
}