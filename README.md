# Zemepán API governor and registry

![Build Status](https://travis-ci.org/seges/zemepan.svg?branch=master)

Zemepán serves as your central registry for APIs and JSON schemas suitable for microservices and serverless functions. As JSON schema registry it can be used in combination of your favorite IDE or editor to validate any JSON you create. The API can refer to such schemas and either be deployed in the registry or reference parts of APIs stored in the registry.

## Start

`docker run -v ./api:/opt/zemepan/api -v ./schema:/opt/zemepan/schema seges/zemepan:1.0.0`

## Environment configuration

| Variable                     | Default value      | Description
| -----------------------------| ------------------ | ------------------
| NODE_ENV                     |                    |
| SSL                          | false              |
| http__port                   | 60000              |
| http__ssl__key_file          | $(cwd)/ca/key.pem  |
| http__ssl__cert_file         | $(cwd)/ca/cert.pem |
| server__root_dir             | <empty>            |
| server__source_url           |                    |
| server__target_url           | 'host' header      |

## Develop

### Prepare .npmrc

Create `.npmrc` in the root:

```
save-exact=true
prefix=/home/developer/.npm-global
```

### Use Docker for development

`docker-compose up -d dev`
`docker-compose exec dev zsh`

### Publish

`docker-compose build zemepan`
`docker-compose push zemepan`

