Demonstration of connecting Prisma to Postgres with client + server SSL certificates
Derived from github.com/prisma/prisma-examples/typescript/rest-nextjs-api-routes

Illustrating unhelpful error on incorrect client cert password when deployed to Vercel serverless (i.e. AWS lambda):

## with env DB_CLIENT_CERT_PASSWORD=certpassword:

locally: `next dev` + `next build; next start` produces error as expected (since we've specified 127.0.0.1 as postgres server, which doesn't exist):

```
PrismaClientInitializationError: Can't reach database server at `127.0.0.1`:`5432`
Please make sure your database server is running at `127.0.0.1`:`5432`
```

when deployed to Vercel: same, as expected.

## with env DB_CLIENT_CERT_PASSWORD not set or set incorrectly:

locally: `next dev` + `next build; next start` produces error as expected:

```
PrismaClientInitializationError: Error opening a TLS connection: MAC verification failed during PKCS12 import (wrong password?)
    at Object.request (<...>/node_modules/@prisma/client/runtime/index.js:39824:15)
```

when deployed to Vercel (serverless function, i.e. AWS Lambda) - we get unhelpful 'permission denied' error (with the 'mac verify failure' also present - but buried):

```
PrismaClientInitializationError: Error opening a TLS connection: error:0200100D:system library:fopen:Permission denied:crypto/bio/bss_file.c:69:fopen('/root/build/target/release/build/openssl-sys-cacd48fffbb900ae/out/openssl-build/install/ssl/openssl.cnf','rb'), error:2006D002:BIO routines:BIO_new_file:system lib:crypto/bio/bss_file.c:78:, error:0E078002:configuration file routines:def_load:system lib:crypto/conf/conf_def.c:170:, error:23076071:PKCS12 routines:PKCS12_parse:mac verify failure:crypto/pkcs12/p12_kiss.c:70:
    at Object.request (/var/task/node_modules/@prisma/client/runtime/index.js:39824:15)
```

Expected behaviour on Vercel would be the same error as locally.
