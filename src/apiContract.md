<!-- 3.2 Get Account Status

Endpoint: GET /v1/transporter/account/status LD References: LD-51, LD-51.1

Response Success (200 OK) - Suspended Account
{
“Message”: {“Code”: 200, “Text”: “Account status retrieved successfully”},
“Data”: {
“accountStatus”: “suspended”, // active, suspended, banned
“isSuspended”: true,
“suspendedAt”: “2025-01-20T09:00:00Z”, // [dbt_mt_users.suspended_at]
“suspensionReason”: “Pelanggaran kebijakan layanan”, // [dbt_mt_users.suspension_reason]
“suspensionMessage”: “Akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivitas kembali”,
“contactSupport”: {
“whatsapp”: “+6281234567890”,
“linkText”: “disini”,
“hoverColor”: “#c53030”
},
“canAppeal”: true,
“appealDeadline”: “2025-02-19T23:59:59Z”
},
“Type”: “ACCOUNT_STATUS_SUSPENDED”
} -->

<!-- 3.3 Get Dashboard Menu Options

Endpoint: GET /v1/transporter/dashboard/menu-options LD References: LD-51.2, LD-51.3

Response Success (200 OK)
{
“Message”: {“Code”: 200, “Text”: “Dashboard menu options retrieved”},
“Data”: {
“currentDashboard”: “real-time”, // analytics, real-time
“dropdownOpen”: false,
“availableOptions”: [
{“type”: “analytics”, “label”: “Dashboard Analytics”, “url”: “/dashboard/analytics”, “isActive”: false},
{“type”: “real-time”, “label”: “Dashboard Real-time”, “url”: “/dashboard/real-time”, “isActive”: true}
],
“chevronDirection”: “down”, // up when dropdown open
“hoverEffects”: {
“enabled”: true,
“hoverColor”: “#f5f5f5”
},
“navigationItems”: [“Monitoring”, “Manajemen Armada”, “Manajemen Driver”, “Agenda Armada Driver”, “Daftar Pesanan”, “Laporan”, “Pengaturan”]
},
“Type”: “DASHBOARD_MENU_OPTIONS”
} -->

4.3 Get Filtered Orders - Waiting Confirmation

Endpoint: GET /v1/transporter/orders/waiting-confirmation LD References: LD-60, LD-60.1

Query Parameters
Parameters
| Parameter | Tipe | Required | Default |Deskripsi |
| :------- | :---- | :---- | :---- | :-------------------------- |
| page | interger | No | 1 |Page Number |
| limit | integer | No | 10 |Items per page |
| search | string | No | - |Search term ( min 3 chars) |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Saran pencarian berhasil dimuat"
},
"Data": {
"suggestions": [
{
"type": "LICENSE_PLATE", // [dbt_mt_agenda_search_cache.searchType]
"value": "B1234ABC",
"label": "B 1234 ABC - Box Truck",
"fleetID": "uuid", // [dbm_mt_fleet.id]
"matchCount": 3
},
{
"type": "DRIVER_NAME",
"value": "John Doe",
"label": "John Doe - Driver",
"driverID": "uuid", // [dbt_mt_drivers.id]
"matchCount": 2
}
],
"cacheHit": true
},
"Type": "GET_SEARCH_SUGGESTIONS"
} -->

<!--
7. Get Schedule Conflicts

Deskripsi
Mengambil daftar konflik jadwal yang terdeteksi

Endpoint
GET /v1/transporter/agenda-schedules/conflicts

LD References
LDF-29 - Modal Edit Jadwal Bertabrakan (Armada View)
LDF-62 - Modal Edit Jadwal Bertabrakan (Driver View)

Parameters
Query Parameters
| Parameter | Tipe | Wajib | Default Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| resolution_status | string | Tidak |PENDING |status resolusi: PENDING/RESLVED |

Request Headers
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Data konflik jadwal berhasil dimuat"
},
"Data": {
"conflicts": [
{
“orderId”: “ORD-2025-001234”, // [dbt_mt_orders.order_id]
“orderNumber”: “MTO240122001”, // [dbt_mt_orders.order_number]
“customerName”: “PT Maju Jaya”, // [dbt_mt_orders.customer_name]
“route”: “Jakarta - Surabaya”, // [dbt_mt_orders.pickup_city] - [dbt_mt_orders.delivery_city]
“scheduledDate”: “2025-01-23T08:00:00Z”, // [dbt_mt_orders.scheduled_date]
“cargoType”: “General Cargo”, // [dbt_mt_orders.cargo_type]
“status”: “waiting_confirmation”, // [dbt_mt_orders.status]
“createdAt”: “2025-01-22T14:30:00Z”, // [dbt_mt_orders.created_at]
“estimatedEarning”: 2500000 // [dbt_mt_orders.estimated_earning]
}
],
“pagination”: {“currentPage”: 1, “totalPages”: 1, “totalItems”: 5, “itemsPerPage”: 10},
“filterActive”: “waiting_confirmation”
},
“Type”: “FILTERED_ORDERS_LIST”
}
Response Success (200 OK) - No Data
LD References: LD-60.1
{
“Message”: {“Code”: 200, “Text”: “No waiting confirmation orders found”},
“Data”: {
“orders”: [],
“pagination”: {“currentPage”: 1, “totalPages”: 0, “totalItems”: 0, “itemsPerPage”: 10},
“filterActive”: “waiting_confirmation”,
“emptyState”: {
“illustration”: “magnifying_glass”,
“message”: “Data Tidak Ditemukan, Mohon coba hapus beberapa filter.”,
“showIllustration”: true
}
},
“Type”: “FILTERED_ORDERS_EMPTY”
}

4.4 Get Filtered Orders - Confirmed
Endpoint: GET /v1/transporter/orders/confirmed LD References: LD-61
[Similar structure to 4.3 with status = ‘confirmed’]

4.5 Get Filtered Orders - Scheduled
Endpoint: GET /v1/transporter/orders/scheduled
LD References: LD-62
[Similar structure to 4.3 with status = ‘scheduled’]

4.6 Get Filtered Orders - Loading
Endpoint: GET /v1/transporter/orders/loading LD References: LD-63
[Similar structure to 4.3 with status = ‘loading’]

4.7 Get Filtered Orders - Unloading
Endpoint: GET /v1/transporter/orders/unloading LD References: LD-64
[Similar structure to 4.3 with status = ‘unloading’]

4.8 Get Filtered Orders - Document Preparation
Endpoint: GET /v1/transporter/orders/document-preparation LD References: LD-65
[Similar structure to 4.3 with status = ‘document_preparation’]

4.9 Get Filtered Orders - Document Delivery
Endpoint: GET /v1/transporter/orders/document-delivery LD References: LD-66
[Similar structure to 4.3 with status = ‘document_delivery’]

4.10 Get Filtered Orders - Completed
Endpoint: GET /v1/transporter/orders/completed LD References: LD-67
[Similar structure to 4.3 with status = ‘completed’]
