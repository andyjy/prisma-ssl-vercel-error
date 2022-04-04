import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient

const serverSSLCertPath = process.env.VERCEL ? '/var/task/demo-server-ca.cer' : '../demo-server-ca.cer';
const clientSSLCertPath = process.env.VERCEL ? '/var/task/demo-client-identity.p12' : '../demo-client-identity.p12';

const config = {
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL.replace('%SSL_CERT%', serverSSLCertPath)}${process.env.SKIP_CLIENT_CERT ? '' : `&sslidentity=${clientSSLCertPath}&sslpassword=${process.env.DB_CLIENT_CERT_PASSWORD}`}`
    }
  }
}
console.dir(config);

// reference SSL cert files to force Vercel to include them in the
// AWS Lambda serverless function build
//
// fixes: PrismaClientInitializationError: Error opening a TLS connection:
//        cert file not found (No such file or directory (os error 2))
//
import fs from "fs";
if (process.env.CI) {
  fs.access(
    process.cwd() + "/demo-server-ca.cer",
    () => undefined
  );
  fs.access(
    process.cwd() + "/demo-client-identity.p12",
    () => undefined
  );
}

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient(config)
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient(config)
    }
    prisma = global.prisma
  }
} catch (e) {
  console.error(e);
}
export default prisma
