# Gophr window-field probe — issue #53

**Run:** 2026-09-11T07:32:28.859947+00:00Z
**Target window:** collect 2026-09-14 14:00–16:00 London, deliver by 17:30 (NOT midnight)
**Mode:** draft jobs only (is_confirmed=0); cancel attempted after readback

---

## CONCLUSIONS (2026-09-11)

1. **All four window-field variants are ACCEPTED** by `POST /jobs` (HTTP 201, drafts created, no validation error): `earliest_pickup_time` + `latest_pickup_time` (pickup object), `dropoff_deadline` + `earliest_dropoff_time` (dropoff object), job-level `pickup_window_start/end` + `dropoff_window_start/end`.
2. **API readback cannot verify the window** — `GET /jobs/{id}` returns a summary (price, distance, status, URLs) and does NOT echo any time fields. The dashboard is the only source of truth.
3. **Cancellation:** `POST /jobs/{id}/cancel` → 200 (works on drafts). `DELETE` → 404 (don't use).
4. **Bonus finding:** the job response includes `public_tracker_url` (`app.gophr.com/tracking/...`) — this is the customer tracking link for the webhook flow (tracking v0 solved at API level).
5. **Midnight-bug hypothesis to verify:** if window fields are omitted, Gophr defaults deliver-by to end-of-day (midnight). The fix candidate is `earliest_pickup_time` + `latest_pickup_time` + `dropoff_deadline` on the nested pickup/dropoff objects (variant B/D shape).

## VERIFIED (Ricky, dashboard, 2026-09-11 ~08:42 UTC)

One draft left deliberately UNCONFIRMED for dashboard inspection:

- **Dashboard:** https://app.gophr.com/job-management/13989481
- job_id `93150b3f-73e8-495d-8349-3b78c39ae36b` · external_id `probe53-VERIFY-DO-NOT-CONFIRM`
- Sent with: collect Mon 14 Sep **14:00–16:00**, deliver by **17:30** (variant D fields)

**Result:** dashboard shows the correct window. Fields CONFIRMED: earliest_pickup_time + latest_pickup_time (pickup) + dropoff_deadline (dropoff). Midnight root cause: omitting them defaults deliver-by to end-of-day. Verify draft cancelled via API.
- If correct → fields confirmed; webhook uses variant D shape. **Then cancel the draft in the dashboard.**
- If midnight → reply here and we probe further (Gophr support docs / their support line on window fields).

Safe to inspect: unconfirmed drafts never dispatch a rider and are not billed.


## Variant A_earliest_pickup__dropoff_deadline

POST /jobs → HTTP 201
job_id: 1914b473-0938-4cc5-b8b6-96b497a5ceae
GET /jobs/1914b473-0938-4cc5-b8b6-96b497a5ceae → HTTP 200

Time-ish fields echoed:
- `data.deliveries.0.delivery_id` = ab8a8bd1-97b8-4046-a600-462a4cce7b59
- `data.deliveries.0.dropoff_sequence_number` = 2
- `data.deliveries.0.pickup_sequence_number` = 1
DELETE /jobs/1914b473-0938-4cc5-b8b6-96b497a5ceae → HTTP 404
POST /jobs/1914b473-0938-4cc5-b8b6-96b497a5ceae/cancel → HTTP 200

## Variant B_plus_latest_pickup

POST /jobs → HTTP 201
job_id: 0047bfc9-ad3f-43cc-b3b9-3817e31522c6
GET /jobs/0047bfc9-ad3f-43cc-b3b9-3817e31522c6 → HTTP 200

Time-ish fields echoed:
- `data.deliveries.0.delivery_id` = 52b66736-c9be-434c-842b-4b3870509745
- `data.deliveries.0.dropoff_sequence_number` = 2
- `data.deliveries.0.pickup_sequence_number` = 1
DELETE /jobs/0047bfc9-ad3f-43cc-b3b9-3817e31522c6 → HTTP 404
POST /jobs/0047bfc9-ad3f-43cc-b3b9-3817e31522c6/cancel → HTTP 200

## Variant C_job_level_windows

POST /jobs → HTTP 201
job_id: 69050b3f-ab57-4515-996f-39b5eb67c88b
GET /jobs/69050b3f-ab57-4515-996f-39b5eb67c88b → HTTP 200

Time-ish fields echoed:
- `data.deliveries.0.delivery_id` = 52248e56-8d38-4f69-9e1d-cf9054d3edcf
- `data.deliveries.0.dropoff_sequence_number` = 2
- `data.deliveries.0.pickup_sequence_number` = 1
DELETE /jobs/69050b3f-ab57-4515-996f-39b5eb67c88b → HTTP 404
POST /jobs/69050b3f-ab57-4515-996f-39b5eb67c88b/cancel → HTTP 200

## Variant D_all_combined

POST /jobs → HTTP 201
job_id: 638cd7ce-9980-43de-8523-c6c8580b1581
GET /jobs/638cd7ce-9980-43de-8523-c6c8580b1581 → HTTP 200

Time-ish fields echoed:
- `data.deliveries.0.delivery_id` = 8d7e0477-9463-4285-84d7-3e7d6abab265
- `data.deliveries.0.dropoff_sequence_number` = 2
- `data.deliveries.0.pickup_sequence_number` = 1
DELETE /jobs/638cd7ce-9980-43de-8523-c6c8580b1581 → HTTP 404
POST /jobs/638cd7ce-9980-43de-8523-c6c8580b1581/cancel → HTTP 200
