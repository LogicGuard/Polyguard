"""Prometheus metrics for PolyGuard RPC proxy and firewall observability."""

from prometheus_client import Counter, Histogram, Gauge
import time

# RPC Proxy Metrics
rpc_requests_total = Counter(
    'rpc_proxy_requests_total',
    'Total RPC requests processed',
    ['method', 'status']
)

rpc_request_duration_ms = Histogram(
    'rpc_proxy_request_duration_ms',
    'RPC request latency in milliseconds',
    ['method'],
    buckets=(1, 5, 10, 15, 25, 50, 100, 250, 500, 1000, 2000)
)

rpc_connections_active = Gauge(
    'rpc_proxy_connections_active',
    'Active RPC proxy connections'
)

# Firewall Metrics
firewall_verdicts_total = Counter(
    'firewall_verdicts_total',
    'Total firewall verdicts',
    ['action']  # BLOCKED, ALLOWED, QUARANTINED
)

firewall_inspection_duration_ms = Histogram(
    'firewall_inspection_duration_ms',
    'Firewall inspection latency',
    buckets=(0.1, 0.5, 1, 2, 5, 10, 15)
)

firewall_threat_detections = Counter(
    'firewall_threat_detections_total',
    'Threats detected by firewall',
    ['threat_type']  # MEV_SANDWICH, REENTRANCY, FLASHLOAN, etc.
)

# Rate Limiter Metrics
rate_limit_rejections_total = Counter(
    'rate_limit_rejections_total',
    'Rate limit rejections',
    ['client_ip']
)

rate_limiter_bucket_capacity = Gauge(
    'rate_limiter_bucket_capacity',
    'Token bucket remaining capacity',
    ['bucket_name']
)

# Memory/State Metrics
transaction_queue_size = Gauge(
    'transaction_queue_size',
    'Pending transactions in queue'
)

merkle_tree_proof_validations = Counter(
    'merkle_tree_validations_total',
    'Merkle tree proof validations',
    ['result']  # VALID, INVALID
)


def record_rpc_request(method: str, status: str, duration_ms: float):
    """Record an RPC request for observability."""
    rpc_requests_total.labels(method=method, status=status).inc()
    rpc_request_duration_ms.labels(method=method).observe(duration_ms)


def record_firewall_verdict(action: str):
    """Record a firewall verdict."""
    firewall_verdicts_total.labels(action=action).inc()


def record_threat_detection(threat_type: str):
    """Record a threat detection."""
    firewall_threat_detections.labels(threat_type=threat_type).inc()


def record_inspection(duration_ms: float):
    """Record firewall inspection time."""
    firewall_inspection_duration_ms.observe(duration_ms)
