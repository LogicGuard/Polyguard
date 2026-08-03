#!/usr/bin/env bash
set -euo pipefail

# PolyGuard RPC Proxy & Firewall Load Test
# Measures throughput, latency, and error rates under load

TARGET_HOST="${1:-http://localhost:3000}"
DURATION_SECONDS="${2:-60}"
CONCURRENT_CONNECTIONS="${3:-10}"
RESULTS_FILE="LOAD_TEST_RESULTS.txt"

echo "======================================"
echo "PolyGuard Load Test Suite"
echo "======================================"
echo "Target: $TARGET_HOST"
echo "Duration: ${DURATION_SECONDS}s"
echo "Concurrent Connections: $CONCURRENT_CONNECTIONS"
echo "Results: $RESULTS_FILE"
echo ""

{
  echo "Load Test Results - $(date)"
  echo "Target: $TARGET_HOST"
  echo "Duration: ${DURATION_SECONDS}s"
  echo "Concurrent Connections: $CONCURRENT_CONNECTIONS"
  echo ""
  echo "Test 1: Firewall Simulation (Normal Defi Operation)"
  echo "=========================================="
  
  # Use Apache Bench if available, otherwise fallback to curl
  if command -v ab &> /dev/null; then
    ab -n 1000 -c "$CONCURRENT_CONNECTIONS" -t "$DURATION_SECONDS" "$TARGET_HOST/api/v1/firewall/simulate" 2>&1 || true
  else
    echo "Apache Bench (ab) not available. Running fallback test..."
    for i in $(seq 1 100); do
      curl -s -X POST "$TARGET_HOST/api/v1/firewall/simulate" \
        -H "Content-Type: application/json" \
        -d '{"calldata":"0xa9059cbb","value_matic":100}' \
        -w "\nResponse Time: %{time_total}s, HTTP Status: %{http_code}\n" \
        -o /dev/null || true
    done
  fi
  
  echo ""
  echo "Test 2: Contract Audit (AST Analysis)"
  echo "=========================================="
  
  AUDIT_PAYLOAD='{
    "source_code": "pragma solidity ^0.8.0; contract Test { function withdraw() public { payable(msg.sender).call{value: address(this).balance}(\"\"); } }"
  }'
  
  # Run 50 audit requests
  for i in $(seq 1 50); do
    curl -s -X POST "$TARGET_HOST/api/v1/audit/analyze" \
      -H "Content-Type: application/json" \
      -d "$AUDIT_PAYLOAD" \
      -w "\nRequest $i - Response Time: %{time_total}s, HTTP Status: %{http_code}\n" \
      -o /dev/null || true
    sleep 0.1
  done
  
  echo ""
  echo "Test 3: MEV Sandwich Attack Detection"
  echo "=========================================="
  
  # Run 100 MEV detection requests
  for i in $(seq 1 100); do
    curl -s -X POST "$TARGET_HOST/api/v1/mev/simulate-mempool" \
      -H "Content-Type: application/json" \
      -d '{"target_pool":"0x45dda9cb7c25131df268515131f647d726f50608","max_slippage_pct":2.5}' \
      -w "\nRequest $i - Response Time: %{time_total}s\n" \
      -o /dev/null || true
  done
  
  echo ""
  echo "Test 4: Health & Status Endpoints"
  echo "=========================================="
  
  # Run 500 rapid health checks
  for i in $(seq 1 500); do
    curl -s "$TARGET_HOST/api/v1/health" \
      -w "\nRequest $i - Response Time: %{time_total}s\n" \
      -o /dev/null || true
  done
  
  echo ""
  echo "Test 5: Rate Limiter Stress Test"
  echo "=========================================="
  
  # Attempt to exceed rate limits
  for i in $(seq 1 200); do
    curl -s "$TARGET_HOST/api/v1/health" \
      -w "\nRequest $i - Response Time: %{time_total}s, HTTP Status: %{http_code}\n" \
      -o /dev/null || true
  done
  
  echo ""
  echo "======================================"
  echo "Load Test Complete - $(date)"
  echo "======================================"
  
} | tee "$RESULTS_FILE"

echo "Results saved to $RESULTS_FILE"
