# Zemepán API governor and registry

![Build Status](https://travis-ci.org/seges/zemepan.svg?branch=master)

[![Docker Container](http://dockeri.co/image/seges/zemepan)](https://registry.hub.docker.com/u/seges/zemepan/)

Zemepán serves as your central registry for APIs and JSON schemas suitable for microservices and serverless functions. As JSON schema registry it can be used in combination of your favorite IDE or editor to validate any JSON you create. The API can refer to such schemas and either be deployed in the registry or reference parts of APIs stored in the registry.

## Start

`docker run -v ./api:/opt/zemepan/api -v ./schema:/opt/zemepan/schema seges/zemepan:1.0.0`

## Endpoints

| Endpoint           | Filesystem            | Description
| ------------------ | --------------------- | ------------
| `base_path`        | `root_dir/swagger_ui` | Serves Swagger UI
| `base_path/api`    | `root_dir/api`        | Holds OpenAPI schema definitions
| `base_path/schema` | `root_dir/schema`     | Holds JSON schema definitions


## Environment configuration

| Variable                     | Default value      | Description
| -----------------------------| ------------------ | ------------------
| NODE_ENV                     |                    |
| SSL                          | false              |
| http__port                   | 60000              |
| http__ssl__key_file          | $(cwd)/ca/key.pem  |
| http__ssl__cert_file         | $(cwd)/ca/cert.pem |
| server__root_dir             | <empty>            | Defines directory where JSON files being served are stored on the filesystem. It should contain trailing slash.
| server__base_path            | /                  | Server publishes 'api' and 'schema' endpoints from the base path. It starts with leading slash usually.
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

### Testing

`npm run dev`

* access test API: http://my-workstation:50000/registry/?url=api/emptyApi.json

### Publish

`docker-compose build zemepan`
`docker-compose push zemepan`

