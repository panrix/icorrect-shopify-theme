# Gophr One Postcode Probe

**Generated:** 2026-05-05T03:33:49+00:00
**Mode:** dry run
**Base URL:** `https://api-sandbox.gophr.com/v2-commercial-api`

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
| SW18 | SW18 4TF | pushbike | 0 | dry_run |  |  |  |  |
| SW18 | SW18 4TF | motorcycle | 0 | dry_run |  |  |  |  |
| W1T | W1T 2LY | pushbike | 0 | dry_run |  |  |  |  |
| W1T | W1T 2LY | motorcycle | 0 | dry_run |  |  |  |  |

## Redacted Payload Shape

```json
[
  {
    "dropoffs": [
      {
        "dropoff_address1": "Wandsworth High Street",
        "dropoff_city": "London",
        "dropoff_country_code": "GB",
        "dropoff_mobile_number": "07123456789",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "SW18 4TF",
        "parcels": [
          {
            "description": "Apple device for repair",
            "external_id": "parcel-sw18-pushbike",
            "height": 8,
            "is_not_rotatable": 0,
            "length": 38,
            "weight": 5,
            "width": 28
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
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "07123456789",
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
        "dropoff_mobile_number": "07123456789",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "SW18 4TF",
        "parcels": [
          {
            "description": "Apple device for repair",
            "external_id": "parcel-sw18-motorcycle",
            "height": 8,
            "is_not_rotatable": 0,
            "length": 38,
            "weight": 5,
            "width": 28
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
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "07123456789",
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
        "dropoff_mobile_number": "07123456789",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "W1T 2LY",
        "parcels": [
          {
            "description": "Apple device for repair",
            "external_id": "parcel-w1t-pushbike",
            "height": 8,
            "is_not_rotatable": 0,
            "length": 38,
            "weight": 5,
            "width": 28
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
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "07123456789",
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
        "dropoff_mobile_number": "07123456789",
        "dropoff_person_name": "Courier Probe",
        "dropoff_postcode": "W1T 2LY",
        "parcels": [
          {
            "description": "Apple device for repair",
            "external_id": "parcel-w1t-motorcycle",
            "height": 8,
            "is_not_rotatable": 0,
            "length": 38,
            "weight": 5,
            "width": 28
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
        "pickup_address1": "12 Margaret Street",
        "pickup_city": "London",
        "pickup_country_code": "GB",
        "pickup_mobile_number": "07123456789",
        "pickup_person_name": "iCorrect",
        "pickup_postcode": "W1W 8JQ"
      }
    ],
    "vehicle_type": 20
  }
]
```
