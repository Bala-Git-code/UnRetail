const PORT = process.env.PORT || 5001;
const BASE_URL = process.env.API_URL || `http://127.0.0.1:${PORT}/api/v1`;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

let passed = 0;
let failed = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message} ${details ? '(' + JSON.stringify(details) + ')' : ''}`);
    failed++;
  }
}

async function runE2ETest() {
  console.log('\n🚀 Starting UnRetail End-to-End API Test Suite...\n');

  let adminToken = null;
  let customerToken = null;
  let merchantToken = null;
  let merchantUserId = null;
  let customerUserId = null;
  let createdOrderId = null;
  let testItemId = 'item-101';
  let createdDisputeId = null;

  // 1. Health Checks
  console.log('--- 1. System Health ---');
  const healthRes = await request('/health');
  assert(healthRes.status === 200 && healthRes.data?.status === 'ok', 'Health Check endpoint responding');

  // 2. Public Catalog & Shops
  console.log('\n--- 2. Public Catalog & Shops ---');
  const shopsRes = await request('/shops');
  assert(shopsRes.status === 200 && Array.isArray(shopsRes.data?.data || shopsRes.data), 'Shops list endpoint returned data');

  const itemsRes = await request('/items');
  assert(itemsRes.status === 200 && Array.isArray(itemsRes.data?.data || itemsRes.data), 'Items catalog endpoint returned listings');
  if (itemsRes.data?.data?.[0]?.id) {
    testItemId = itemsRes.data.data[0].id;
  }

  const itemDetailRes = await request(`/items/${testItemId}`);
  assert(itemDetailRes.status === 200, `Item detail endpoint for ID (${testItemId}) returned successfully`);

  const categoryRes = await request('/items/categories');
  assert(categoryRes.status === 200, 'Item categories list returned');

  // 3. Authentication & Role Sessions
  console.log('\n--- 3. Authentication & JWT Sessions ---');
  
  // 3.1 Admin Login
  const adminLoginRes = await request('/auth/admin-login', {
    method: 'POST',
    body: {
      email: 'balagiri702@gmail.com',
      password: '0987654321zxcvbnm',
    },
  });
  assert(adminLoginRes.status === 200 && adminLoginRes.data?.token, 'Admin authentication successful');
  adminToken = adminLoginRes.data?.token;

  // 3.2 Customer Demo Auth
  const customerAuthRes = await request('/auth/google', {
    method: 'POST',
    body: {
      email: `customer.${Date.now()}@unretail.in`,
      fullName: 'Test Customer Rahul',
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    },
  });
  assert(customerAuthRes.status === 200 && customerAuthRes.data?.token, 'Customer Demo auth session generated');
  customerToken = customerAuthRes.data?.token;
  customerUserId = customerAuthRes.data?.user?.id;

  // 3.3 Merchant Demo Auth
  const merchantAuthRes = await request('/auth/google', {
    method: 'POST',
    body: {
      email: `merchant.${Date.now()}@unretail.in`,
      fullName: 'Test Boutique Merchant Aarav',
      role: 'MERCHANT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    },
  });
  assert(merchantAuthRes.status === 200 && merchantAuthRes.data?.token, 'Merchant Demo auth session generated');
  merchantToken = merchantAuthRes.data?.token;
  merchantUserId = merchantAuthRes.data?.user?.id;

  // 3.4 Session Validation (/auth/me)
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(meRes.status === 200 && meRes.data?.user?.role === 'ADMIN', 'Session verification /auth/me verified for Admin');

  // 4. Merchant KYC Onboarding & Admin Approval
  console.log('\n--- 4. Merchant KYC & Admin Approval Gating ---');
  
  const onboardingRes = await request('/merchant/onboarding', {
    method: 'POST',
    headers: { Authorization: `Bearer ${merchantToken}` },
    body: {
      shopName: 'Archive Vault Bandra',
      city: 'Mumbai',
      address: '42 Pali Hill Road',
      phoneNumber: '+91 98201 12345',
      idProofType: 'Aadhaar Card',
      idProofNumber: '8921 4452 9012',
      idProofImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      idPhotoImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    },
  });
  assert(onboardingRes.status === 200, 'Merchant submitted KYC documents');

  // Admin approves merchant
  const approveRes = await request(`/merchant/admin/${merchantUserId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(approveRes.status === 200, 'Admin approved merchant KYC credentials');

  const merchantStatusRes = await request('/merchant/status', {
    headers: { Authorization: `Bearer ${merchantToken}` },
  });
  assert(merchantStatusRes.status === 200 && merchantStatusRes.data?.data?.merchantStatus === 'APPROVED', 'Merchant verified as APPROVED');

  // 5. Merchant Inventory Desk
  console.log('\n--- 5. Merchant Inventory & Product Creation ---');
  
  const merchantStatsRes = await request('/merchant/dashboard-stats', {
    headers: { Authorization: `Bearer ${merchantToken}` },
  });
  assert(merchantStatsRes.status === 200, 'Merchant dashboard analytics endpoint returned metrics');

  // Create new listing
  const newItemRes = await request('/items', {
    method: 'POST',
    headers: { Authorization: `Bearer ${merchantToken}` },
    body: {
      title: 'Y2K Vintage Cyberpunk Moto Jacket',
      description: 'Archival heavyweight racing jacket with reflective piping.',
      price: 6499,
      category: 'Outerwear',
      subcategory: 'Jackets',
      era: '2000s',
      size: 'L',
      condition: 'LIKE_NEW',
      images: ['/images/denim_vintage.png'],
    },
  });
  assert(newItemRes.status === 201 && newItemRes.data?.data?.id, 'Approved Merchant created a new 1-of-1 listing');
  const newlyCreatedItemId = newItemRes.data?.data?.id;

  // Merchant Orders Desk
  const merchantOrdersRes = await request('/orders/merchant', {
    headers: { Authorization: `Bearer ${merchantToken}` },
  });
  assert(merchantOrdersRes.status === 200, 'Merchant orders fulfillment queue retrieved');

  // 6. Cart Validation, Checkout & Escrow Lock
  console.log('\n--- 6. Cart Validation & Razorpay Escrow Flow ---');
  
  const itemToBuy = newlyCreatedItemId || testItemId;

  const cartValidationRes = await request('/cart/validate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: { itemIds: [itemToBuy] },
  });
  assert(cartValidationRes.status === 200, 'Cart stock atomic validation endpoint works');

  const createOrderRes = await request('/payments/create-order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      itemIds: [itemToBuy],
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        street: '100 Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400020',
      },
    },
  });
  assert(createOrderRes.status === 201 && createOrderRes.data?.razorpayOrderId, 'Payment Intent creation successfully generated Razorpay order ID');
  
  const rzpOrderId = createOrderRes.data?.razorpayOrderId;
  const orderList = createOrderRes.data?.orders;
  createdOrderId = orderList?.[0]?.id || 'ord_latest';

  // 6.2 Payment Verification
  const verifyRes = await request('/payments/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      razorpay_order_id: rzpOrderId,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      razorpay_signature: 'dev_mock_signature',
      orderIds: orderList?.map(o => o.id),
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
      },
    },
  });
  assert(verifyRes.status === 200 && verifyRes.data?.success, 'Payment verification & Escrow hold establishment succeeded');

  // 7. Order Tracking & Lifecycle Transition
  console.log('\n--- 7. Order Fulfillment & Delivery Tracking ---');
  
  const buyerOrdersRes = await request('/orders/buyer', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  assert(buyerOrdersRes.status === 200, 'Buyer order history endpoint accessible');

  const orderDetailRes = await request(`/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  assert(orderDetailRes.status === 200, `Single order tracking (/orders/${createdOrderId}) retrieved successfully`);

  // Merchant marks SHIPPED
  const shipRes = await request(`/orders/${createdOrderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      status: 'SHIPPED',
      trackingCode: 'DTDC-IND-884920',
      carrierName: 'Blue Dart Express',
    },
  });
  assert(shipRes.status === 200, 'Order marked as SHIPPED with courier tracking details');

  // Merchant marks DELIVERED (Escrow transitions to ESCROW_HELD, starting 48h inspection window)
  const deliverRes = await request(`/orders/${createdOrderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      status: 'DELIVERED',
    },
  });
  assert(deliverRes.status === 200, 'Order marked as DELIVERED and 48-Hour Escrow inspection window initiated');

  // 8. Admin Governance & Dispute Resolution
  console.log('\n--- 8. Admin Governance, KYC & Disputes ---');

  const allMerchantsRes = await request('/merchant/admin/all', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(allMerchantsRes.status === 200, 'Admin governance fetched all merchant onboardings');

  // Customer Files Dispute during inspection window
  const createDisputeRes = await request('/disputes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      orderId: createdOrderId,
      reason: 'Physical item has unlisted tear near lining.',
    },
  });
  assert(createDisputeRes.status === 201 || createDisputeRes.status === 200, 'Customer successfully filed an Escrow inspection dispute');
  createdDisputeId = createDisputeRes.data?.data?.id;

  // Admin Views Disputes
  const disputesListRes = await request('/disputes', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(disputesListRes.status === 200, 'Admin dispute desk loaded active disputes');

  // Admin Resolves Dispute
  if (createdDisputeId) {
    const resolveDisputeRes = await request(`/disputes/${createdDisputeId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        resolution: 'RELEASE_TO_MERCHANT',
      },
    });
    assert(resolveDisputeRes.status === 200, 'Admin successfully resolved customer dispute and settled escrow');
  }

  console.log('\n=========================================');
  console.log(`🎉 E2E Test Suite Completed!`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log('=========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETest().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
