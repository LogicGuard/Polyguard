FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

# Install core packages
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates curl wget git build-essential pkg-config libssl-dev llvm lld clang jq python3 python3-pip python3-venv software-properties-common gnupg2 unzip make unzip sudo \
  nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# Install solc (solidity compiler) from ethereum PPA (best-effort)
RUN set -eux; \
  add-apt-repository ppa:ethereum/ethereum -y || true; \
  apt-get update -y || true; \
  apt-get install -y --no-install-recommends solc || true; \
  rm -rf /var/lib/apt/lists/* || true

# Install Rust toolchain
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Python tooling and security tools
RUN python3 -m pip install --upgrade pip setuptools wheel
RUN python3 -m pip install slither-analyzer mythril safety pytest pytest-asyncio httpx rdflib owlready2 || true

# Install node tooling
RUN npm install -g npm@latest || true

# Ensure workdir
WORKDIR /workspace

# Lightweight entrypoint just to keep container usable
ENTRYPOINT ["/bin/bash"]
