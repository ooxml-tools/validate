#!/usr/bin/env bash
set -e 

docker () {
    if [[ "$DOCKER_RUNNING" == "true" ]]; then
        echo "Error: Already running inside container"
        help
        exit 1
    fi

    cleanup() {
        rm .build-files/Dockerfile || true
        rm .build-files/compose.yaml || true
        rmdir .build-files || true
    }
    trap cleanup EXIT

    mkdir .build-files
    cat << EOF > .build-files/Dockerfile
FROM ubuntu
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y curl dotnet-sdk-8.0 python3 libatomic1 build-essential && dotnet workload install wasm-tools
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh && bash nodesource_setup.sh && rm nodesource_setup.sh && apt-get install nodejs -y

WORKDIR /code
EOF

    cat << EOF > .build-files/compose.yaml
services:
  dev:
    build:
      dockerfile: ./Dockerfile
    environment:
      - DOCKER_RUNNING=true
    ports:
      - "5035:5035"
      - "7140:7140"
    volumes:
      - ../:/code
EOF

    docker-compose -f .build-files/compose.yaml build
    docker-compose -f .build-files/compose.yaml run --service-ports dev ${@:-bash}
}

docker "$@"
