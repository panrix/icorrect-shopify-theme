# Gophr One Postcode Probe

**Generated:** 2026-05-05T03:51:47+00:00
**Mode:** live API call
**Base URL:** `https://api.gophr.com/v2-commercial-api`
**Service window:** `economy-2026-05-05`
**Pickup after:** `2026-05-05T12:00:00+01:00`
**Deliver before:** `2026-05-05T18:00:00+01:00`
**Parcel profile:** `small-no-insurance`

## Safety

- The script reads `GOPHR_API_KEY` from the shell environment.
- The API key is never printed or written to this file.
- Payload examples below omit all authentication headers.
- Jobs are requested as draft/quote probes, not confirmed courier bookings.

## Addresses

- Origin: 12 Margaret Street, London, W1W 8JQ
- SW18: Southside Shopping Centre, Wandsworth High Street, London, SW18 4TF (https://www.southsidewandsworth.com/en)
- W1T: The Fitzroy Tavern, 16 Charlotte Street, London, W1T 2LY (https://fitzroytavern.co.uk/contact/)

## Results

| Outward | Postcode | Requested vehicle | HTTP | Status | Net | Gross | Returned vehicle | Error |
|---|---|---:|---:|---|---:|---:|---|---|
| SW18 | SW18 4TF | pushbike | 200 | ok | 14.39 GBP | 17.27 GBP | 10 |  |
| SW18 | SW18 4TF | motorcycle | 200 | ok | 15.84 GBP | 19.01 GBP | 20 |  |
| W1T | W1T 2LY | pushbike | 200 | ok | 7.12 GBP | 8.54 GBP | 10 |  |
| W1T | W1T 2LY | motorcycle | 200 | ok | 7.46 GBP | 8.95 GBP | 20 |  |

## Redacted Payload Shape

```json
[
  {
    "dropoffs": [
      {
        "dropoff_address1": "Wandsworth High Street",
        "dropoff_city": "London",
        "dropoff_country_code": "GB",
        "dropoff_deadline": "2026-05-05T18:00:00+01:00",
        "dropoff_mobile_number": "[REDACTED]",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "SW18 4TF",
        "parcels": [
          {
            "parcel_external_id": "parcel-sw18-pushbike"
          }
        ],
        "sequence_number": 1
      }
    ],
    "external_id": "icorrect-probe-sw18-pushbike",
    "is_confirmed": 0,
    "is_fixed_sequence": 0,
    "meta_data": [
      {
        "key": "source",
        "value": "icorrect-shopify-theme probe"
      },
      {
        "key": "postcode_outward_code",
        "value": "SW18"
      }
    ],
    "pickups": [
      {
        "earliest_pickup_time": "2026-05-05T12:00:00+01:00",
        "parcels": [
          {
            "height": 5,
            "id_check": 0,
            "is_alcohol": 0,
            "is_baked": 0,
            "is_beef": 0,
            "is_flower": 0,
            "is_food": 0,
            "is_fragile": 0,
            "is_glass": 0,
            "is_liquid": 0,
            "is_not_rotatable": 0,
            "is_pork": 0,
            "length": 20,
            "parcel_description": "Small packaged device for repair",
            "parcel_external_id": "parcel-sw18-pushbike",
            "parcel_insurance_value": 0,
            "parcel_reference_number": "parcel-sw18-pushbike",
            "weight": 1,
            "width": 15
          }
        ],
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "[REDACTED]",
        "pickup_person_name": "iCorrect",
        "pickup_postcode": "W1W 8JQ"
      }
    ],
    "vehicle_type": 10
  },
  {
    "dropoffs": [
      {
        "dropoff_address1": "Wandsworth High Street",
        "dropoff_city": "London",
        "dropoff_country_code": "GB",
        "dropoff_deadline": "2026-05-05T18:00:00+01:00",
        "dropoff_mobile_number": "[REDACTED]",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "SW18 4TF",
        "parcels": [
          {
            "parcel_external_id": "parcel-sw18-motorcycle"
          }
        ],
        "sequence_number": 1
      }
    ],
    "external_id": "icorrect-probe-sw18-motorcycle",
    "is_confirmed": 0,
    "is_fixed_sequence": 0,
    "meta_data": [
      {
        "key": "source",
        "value": "icorrect-shopify-theme probe"
      },
      {
        "key": "postcode_outward_code",
        "value": "SW18"
      }
    ],
    "pickups": [
      {
        "earliest_pickup_time": "2026-05-05T12:00:00+01:00",
        "parcels": [
          {
            "height": 5,
            "id_check": 0,
            "is_alcohol": 0,
            "is_baked": 0,
            "is_beef": 0,
            "is_flower": 0,
            "is_food": 0,
            "is_fragile": 0,
            "is_glass": 0,
            "is_liquid": 0,
            "is_not_rotatable": 0,
            "is_pork": 0,
            "length": 20,
            "parcel_description": "Small packaged device for repair",
            "parcel_external_id": "parcel-sw18-motorcycle",
            "parcel_insurance_value": 0,
            "parcel_reference_number": "parcel-sw18-motorcycle",
            "weight": 1,
            "width": 15
          }
        ],
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "[REDACTED]",
        "pickup_person_name": "iCorrect",
        "pickup_postcode": "W1W 8JQ"
      }
    ],
    "vehicle_type": 20
  },
  {
    "dropoffs": [
      {
        "dropoff_address1": "16 Charlotte Street",
        "dropoff_city": "London",
        "dropoff_country_code": "GB",
        "dropoff_deadline": "2026-05-05T18:00:00+01:00",
        "dropoff_mobile_number": "[REDACTED]",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "W1T 2LY",
        "parcels": [
          {
            "parcel_external_id": "parcel-w1t-pushbike"
          }
        ],
        "sequence_number": 1
      }
    ],
    "external_id": "icorrect-probe-w1t-pushbike",
    "is_confirmed": 0,
    "is_fixed_sequence": 0,
    "meta_data": [
      {
        "key": "source",
        "value": "icorrect-shopify-theme probe"
      },
      {
        "key": "postcode_outward_code",
        "value": "W1T"
      }
    ],
    "pickups": [
      {
        "earliest_pickup_time": "2026-05-05T12:00:00+01:00",
        "parcels": [
          {
            "height": 5,
            "id_check": 0,
            "is_alcohol": 0,
            "is_baked": 0,
            "is_beef": 0,
            "is_flower": 0,
            "is_food": 0,
            "is_fragile": 0,
            "is_glass": 0,
            "is_liquid": 0,
            "is_not_rotatable": 0,
            "is_pork": 0,
            "length": 20,
            "parcel_description": "Small packaged device for repair",
            "parcel_external_id": "parcel-w1t-pushbike",
            "parcel_insurance_value": 0,
            "parcel_reference_number": "parcel-w1t-pushbike",
            "weight": 1,
            "width": 15
          }
        ],
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "[REDACTED]",
        "pickup_person_name": "iCorrect",
        "pickup_postcode": "W1W 8JQ"
      }
    ],
    "vehicle_type": 10
  },
  {
    "dropoffs": [
      {
        "dropoff_address1": "16 Charlotte Street",
        "dropoff_city": "London",
        "dropoff_country_code": "GB",
        "dropoff_deadline": "2026-05-05T18:00:00+01:00",
        "dropoff_mobile_number": "[REDACTED]",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "W1T 2LY",
        "parcels": [
          {
            "parcel_external_id": "parcel-w1t-motorcycle"
          }
        ],
        "sequence_number": 1
      }
    ],
    "external_id": "icorrect-probe-w1t-motorcycle",
    "is_confirmed": 0,
    "is_fixed_sequence": 0,
    "meta_data": [
      {
        "key": "source",
        "value": "icorrect-shopify-theme probe"
      },
      {
        "key": "postcode_outward_code",
        "value": "W1T"
      }
    ],
    "pickups": [
      {
        "earliest_pickup_time": "2026-05-05T12:00:00+01:00",
        "parcels": [
          {
            "height": 5,
            "id_check": 0,
            "is_alcohol": 0,
            "is_baked": 0,
            "is_beef": 0,
            "is_flower": 0,
            "is_food": 0,
            "is_fragile": 0,
            "is_glass": 0,
            "is_liquid": 0,
            "is_not_rotatable": 0,
            "is_pork": 0,
            "length": 20,
            "parcel_description": "Small packaged device for repair",
            "parcel_external_id": "parcel-w1t-motorcycle",
            "parcel_insurance_value": 0,
            "parcel_reference_number": "parcel-w1t-motorcycle",
            "weight": 1,
            "width": 15
          }
        ],
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "[REDACTED]",
        "pickup_person_name": "iCorrect",
        "pickup_postcode": "W1W 8JQ"
      }
    ],
    "vehicle_type": 20
  }
]
```

## Response Shape Notes

### SW18 / pushbike / HTTP 200

```json
{
  "data": {
    "delivery_eta": "2026-05-05T12:47:14+01:00",
    "job_priority": 0,
    "min_realistic_time": 71,
    "pickup_eta": "2026-05-05T12:00:00+01:00",
    "price_gross": {
      "amount": 17.27,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 14.39,
      "currency": "GBP"
    },
    "vehicle_type": 10
  }
}
```

### SW18 / motorcycle / HTTP 200

```json
{
  "data": {
    "delivery_eta": "2026-05-05T12:35:45+01:00",
    "job_priority": 0,
    "min_realistic_time": 64,
    "pickup_eta": "2026-05-05T12:00:00+01:00",
    "price_gross": {
      "amount": 19.01,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 15.84,
      "currency": "GBP"
    },
    "vehicle_type": 20
  }
}
```

### W1T / pushbike / HTTP 200

```json
{
  "data": {
    "delivery_eta": "2026-05-05T12:11:21+01:00",
    "job_priority": 0,
    "min_realistic_time": 35,
    "pickup_eta": "2026-05-05T12:00:00+01:00",
    "price_gross": {
      "amount": 8.54,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 7.12,
      "currency": "GBP"
    },
    "vehicle_type": 10
  }
}
```

### W1T / motorcycle / HTTP 200

```json
{
  "data": {
    "delivery_eta": "2026-05-05T12:10:29+01:00",
    "job_priority": 0,
    "min_realistic_time": 38,
    "pickup_eta": "2026-05-05T12:00:00+01:00",
    "price_gross": {
      "amount": 8.95,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 7.46,
      "currency": "GBP"
    },
    "vehicle_type": 20
  }
}
```
