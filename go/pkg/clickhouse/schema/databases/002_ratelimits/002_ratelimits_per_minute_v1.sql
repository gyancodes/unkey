CREATE TABLE IF NOT EXISTS ratelimits.ratelimits_per_minute_v1
(
  time          DateTime,
  workspace_id  String,
  namespace_id  String,
  identifier    String,

  passed        Int64,
  total         Int64
)
ENGINE = SummingMergeTree()
ORDER BY (workspace_id, namespace_id, time, identifier)
;
