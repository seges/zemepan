FROM mhart/alpine-node:8

MAINTAINER Ladislav Gazo <gazo@seges.sk>

RUN mkdir -p /opt/zemepan

COPY package-lock.json /opt/zemepan/
COPY package.json /opt/zemepan/
COPY index.js /opt/zemepan/

EXPOSE 60000

ENV server__root_dir /opt/zemepan/
WORKDIR /opt/zemepan

RUN cd /opt/zemepan && \
    npm i 

CMD [ "node", "index.js" ]
