# Gophr One Postcode Probe

**Generated:** 2026-05-05T03:44:40+00:00
**Mode:** live API call
**Base URL:** `https://api.gophr.com/v2-commercial-api`

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
| SW18 | SW18 4TF | pushbike | 200 | ok | 16.06 GBP | 19.27 GBP | 10 |  |
| SW18 | SW18 4TF | motorcycle | 200 | ok | 17.51 GBP | 21.01 GBP | 20 |  |
| W1T | W1T 2LY | pushbike | 200 | ok | 8.79 GBP | 10.55 GBP | 10 |  |
| W1T | W1T 2LY | motorcycle | 200 | ok | 9.13 GBP | 10.96 GBP | 20 |  |

## Redacted Payload Shape

```json
[
  {
    "dropoffs": [
      {
        "dropoff_address1": "Wandsworth High Street",
        "dropoff_city": "London",
        "dropoff_country_code": "GB",
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
        "parcels": [
          {
            "height": 8,
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
            "length": 38,
            "parcel_description": "Apple device for repair",
            "parcel_external_id": "parcel-sw18-pushbike",
            "parcel_insurance_value": 1000,
            "parcel_reference_number": "parcel-sw18-pushbike",
            "weight": 5,
            "width": 28
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
        "parcels": [
          {
            "height": 8,
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
            "length": 38,
            "parcel_description": "Apple device for repair",
            "parcel_external_id": "parcel-sw18-motorcycle",
            "parcel_insurance_value": 1000,
            "parcel_reference_number": "parcel-sw18-motorcycle",
            "weight": 5,
            "width": 28
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
        "parcels": [
          {
            "height": 8,
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
            "length": 38,
            "parcel_description": "Apple device for repair",
            "parcel_external_id": "parcel-w1t-pushbike",
            "parcel_insurance_value": 1000,
            "parcel_reference_number": "parcel-w1t-pushbike",
            "weight": 5,
            "width": 28
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
        "parcels": [
          {
            "height": 8,
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
            "length": 38,
            "parcel_description": "Apple device for repair",
            "parcel_external_id": "parcel-w1t-motorcycle",
            "parcel_insurance_value": 1000,
            "parcel_reference_number": "parcel-w1t-motorcycle",
            "weight": 5,
            "width": 28
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
    "delivery_eta": "2026-05-05T06:01:50+01:00",
    "job_priority": 0,
    "min_realistic_time": 71,
    "pickup_eta": "2026-05-05T05:14:36+01:00",
    "price_gross": {
      "amount": 19.27,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 16.06,
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
    "delivery_eta": "2026-05-05T05:50:22+01:00",
    "job_priority": 0,
    "min_realistic_time": 64,
    "pickup_eta": "2026-05-05T05:14:37+01:00",
    "price_gross": {
      "amount": 21.01,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 17.51,
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
    "delivery_eta": "2026-05-05T05:25:59+01:00",
    "job_priority": 0,
    "min_realistic_time": 35,
    "pickup_eta": "2026-05-05T05:14:38+01:00",
    "price_gross": {
      "amount": 10.55,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 8.79,
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
    "delivery_eta": "2026-05-05T05:25:08+01:00",
    "job_priority": 0,
    "min_realistic_time": 38,
    "pickup_eta": "2026-05-05T05:14:39+01:00",
    "price_gross": {
      "amount": 10.96,
      "currency": "GBP"
    },
    "price_net": {
      "amount": 9.13,
      "currency": "GBP"
    },
    "vehicle_type": 20
  }
}
```
