<!-- 3. Detail Tambahan Biaya
   3.1 Get Report Detail
   GET /v1/cs/additional-cost-reports/{id}/detail

Response:

{

"success": true,

"data": {

    "report": {

      "id": "report-uuid",

      "order": {

        "code": "MT-2025-001",

        "status": "MENUNGGU PELUNASAN",

        "fleet_count": 2,

        "model": "Instan"

      },

      "shipper": {

        "id": "shipper-uuid",

        "type": "user02",

        "company_name": "PT Shipper Example",

        "logo": "https://cdn.muattrans.com/logos/shipper.jpg",

        "phone": "081234567890",

        "location": "Jakarta Selatan, DKI Jakarta"

      },

      "transporters": [

        {

          "id": "transporter-uuid",

          "name": "PT Transporter ABC",

          "logo": "https://cdn.muattrans.com/logos/transporter.jpg",

          "fleet_count": 2,

          "phone": "081987654321",

          "location": "Tangerang, Banten"

        }

      ],

      "contact_summary": {

        "last_contacted_by": "CS John Doe",

        "last_contacted_at": "2025-01-20T14:30:00Z",

        "total_contacts": 3,

        "days_unpaid": 5

      },

      "cost_breakdown": {

        "waiting_time_cost": 200000,

        "overload_cost": 150000,

        "admin_fee": 50000,

        "tax_amount": 100000,

        "total_amount": 500000

      },

      "payment_deadline": "2025-02-15T23:59:59Z"

    }

}

} -->

<!-- 3.2 Get Waiting Time Details
GET /v1/cs/additional-cost-reports/{id}/waiting-time-details

Response:

{

"success": true,

"data": {

    "drivers": [

      {

        "id": "driver-uuid",

        "name": "Driver Name",

        "license_plate": "B 1234 XYZ",

        "transporter_name": "PT Transporter ABC",

        "waiting_locations": [

          {

            "location_type": "LOKASI MUAT 1",

            "duration": "2 Jam 30 Menit",

            "start_time": "2025-01-15T08:00:00Z",

            "end_time": "2025-01-15T10:30:00Z",

            "cost": 100000

          }

        ],

        "total_cost": 200000

      }

    ],

    "grand_total": 200000

}

} -->

3.3 Get Overload Details
GET /v1/cs/additional-cost-reports/{id}/overload-details

Response:

{

"success": true,

"data": {

    "drivers": [

      {

        "id": "driver-uuid",

        "name": "Driver Name",

        "license_plate": "B 1234 XYZ",

        "transporter_name": "PT Transporter ABC",

        "overload_locations": [

          {

            "location_type": "LOKASI MUAT 1",

            "overload_weight": 500,

            "weight_unit": "kg",

            "cost": 75000,

            "loading_date": "2025-01-15T10:00:00Z"

          }

        ],

        "total_cost": 150000

      }

    ],

    "grand_total": 150000

}

}
