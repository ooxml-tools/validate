#!/usr/bin/env bash
set -e

docker_command() {
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

RUN apt-get update && apt-get install -y wget
RUN wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
     && dpkg -i packages-microsoft-prod.deb \
     && rm packages-microsoft-prod.deb

RUN apt-get update && apt-get install -y curl dotnet-sdk-8.0 python3 libatomic1 build-essential && dotnet workload install wasm-tools
RUN curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh && bash nodesource_setup.sh && rm nodesource_setup.sh && apt-get install nodejs -y
RUN npm install -g pnpm

WORKDIR /code
EOF

  cat << EOF > .build-files/compose.yaml
services:
  dev:
    build:
      dockerfile: ./Dockerfile
    environment:
      - DOCKER_RUNNING=true
    volumes:
      - ../:/code
EOF

  docker compose -f .build-files/compose.yaml build
  docker compose -f .build-files/compose.yaml run --service-ports dev ${@:-bash}
}

docker_command "$@"
