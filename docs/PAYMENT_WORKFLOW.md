# Payment Workflow Guide

This guide explains how to process payments for fees in the 1Ummah SILP platform.

## Overview

The payment workflow involves four main steps:
1. **Generate Fees** - Create fee records for students
2. **Create Payment Request** - Submit payment requests for schools
3. **Approval Process** - Get approvals from authorized personnel
4. **Mark as Paid** - Update fee records when payment is completed

---

## Step-by-Step Payment Process

### Step 1: Generate Fees

**Who:** Program Manager, Finance Officer, or Super Admin
**When:** At the beginning of each term
**Where:** `/dashboard/fees`

1. Navigate to **Dashboard > Fees**
2. Click the **"Generate Fees"** button (top right)
3. Fill in the fee generation form:
   - **Academic Year**: Select the year (e.g., 2025/2026)
   - **Term**: Select First, Second, or Third Term
   - **Schools**: Select one or more schools
4. Click **"Generate Fees"**
5. System creates fee records for all students in selected schools
6. Fee amounts are based on each school's fee structure by class level

**Result:** Fee records are created with status "Pending"

---

### Step 2: Review Generated Fees

**Where:** `/dashboard/fees`

1. View all generated fees in the fees table
2. Use filters to narrow down:
   - School
   - Term
   - Year
   - Status
3. Review:
   - Amount Due
   - Amount Paid
   - Balance
   - Status

---

### Step 3: Create Payment Request

**Who:** School Portal User or Program Manager
**When:** When school is ready to receive payment
**Where:** `/dashboard/payments`

1. Navigate to **Dashboard > Payments**
2. Click **"New Payment Request"** button (top right)
3. Fill in the payment request form:
   - **School**: Select the school
   - **Term**: Select the term (must match fee records)
   - **Academic Year**: Select the year (must match fee records)
   - **Total Amount**: Enter total payment amount
   - **Number of Students**: Enter student count
   - **Invoice/Receipt**: Upload supporting document (optional)
   - **Description**: Add any notes or details
4. Click **"Submit Payment Request"**

**Result:** Payment request is created with status "Pending"

---

### Step 4: Approval Workflow

**Who:** Users with `payments.approve` permission
**When:** After payment request is submitted
**Where:** `/dashboard/approvals`

#### For Approvers:

1. Navigate to **Dashboard > Approvals**
2. View pending approvals in the "Pending" tab
3. Click on a payment request to view details:
   - Request information
   - Amount and school details
   - Supporting documents
   - Approval chain
4. Review the request:
   - Verify amount matches fee records
   - Check supporting documentation
   - Review student count
5. Take action:
   - **To Approve**: Add comment (optional) and click "Approve"
   - **To Reject**: Add reason and click "Reject"

#### Approval Limits:

- **Accountant**: Up to ₦100,000
- **Finance Officer**: Up to ₦200,000
- **Program Manager**: Up to ₦500,000
- **Super Admin**: Up to ₦10,000,000

**Escalation:** If amount exceeds approver's limit, request automatically escalates to next level.

**Result:**
- If approved by all required approvers → Status changes to "Approved"
- If rejected by any approver → Status changes to "Rejected"

---

### Step 5: Mark Fees as Paid

**Who:** Finance Officer or Super Admin
**When:** After payment is approved and sent to school
**Where:** `/dashboard/fees`

#### Option A: Mark Individual Fees as Paid

1. Navigate to **Dashboard > Fees**
2. Filter by school, term, and year to find relevant fees
3. For each fee with a balance:
   - Find the "Mark Paid" button in the Actions column
   - Click **"Mark Paid"**
4. Fee status updates to "Paid" with full amount

#### Option B: Bulk Payment Processing (Future Feature)

1. Navigate to **Dashboard > Payments**
2. View approved payment request
3. Click **"Process Payment"**
4. System automatically marks all associated fees as paid

---

## Common Workflows

### Workflow 1: Full Term Payment

```
1. Generate Fees → All students for Term 1, 2026
2. Create Payment Request → Total for all students
3. Approval → Route through approval chain
4. Mark as Paid → All fees for that term/school
```

### Workflow 2: Partial Payment

```
1. Generate Fees → All students for Term 2, 2026
2. Create Payment Request → Partial amount (e.g., 50%)
3. Approval → Approve partial payment
4. Mark as Paid → Mark individual student fees as needed
5. Create 2nd Payment Request → Remaining amount
6. Repeat approval and mark paid process
```

### Workflow 3: Emergency/Ad-hoc Payment

```
1. Fees already generated
2. Create Payment Request → For specific students
3. Fast-track Approval → Higher authority approves
4. Mark as Paid → Specific student fees
```

---

## Fee Status Meanings

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| **Pending** | Fee generated but not paid | Awaiting payment request |
| **Paid** | Fully paid | None |
| **Overdue** | Payment deadline passed | Urgent: Create payment request |

---

## Payment Request Status

| Status | Meaning | Next Step |
|--------|---------|-----------|
| **Pending** | Awaiting approval | Approver action needed |
| **Approved** | Approved by all required approvers | Process payment |
| **Paid** | Payment sent to school | Mark fees as paid |
| **Rejected** | Rejected by an approver | Review and resubmit |

---

## Best Practices

### For Schools:
1. Submit payment requests promptly at the start of each term
2. Attach school invoices to payment requests
3. Verify student count matches enrolled students
4. Follow up on pending requests via the platform

### For Finance Team:
1. Generate fees at the beginning of each term
2. Review payment requests within 48 hours
3. Verify amounts against fee structures
4. Mark fees as paid immediately after bank transfer
5. Keep payment records organized by term and year

### For Approvers:
1. Review requests daily
2. Check supporting documentation
3. Verify amounts are within your approval limit
4. Add comments explaining approval decisions
5. Escalate unusual requests to Program Manager

---

## Reports and Tracking

### Financial Reports

View payment status at:
- **Dashboard > Reports**: Overall financial summary
- **Dashboard > Fees**: Detailed fee tracking
- **Dashboard > Payments**: Payment request history
- **Dashboard > Schools > [School Detail]**: School-specific payments

### Key Metrics to Monitor:

1. **Total Generated**: All fees for the period
2. **Total Paid**: Payments completed
3. **Total Outstanding**: Unpaid balance
4. **Pending Requests**: Awaiting approval
5. **Approved Requests**: Ready to process

---

## Troubleshooting

### "Cannot create payment request"
**Solution:** Ensure fees have been generated for that school/term/year first.

### "Payment amount doesn't match fees"
**Solution:** Review fee records and adjust payment request amount or split into multiple requests.

### "Approval limit exceeded"
**Solution:** Request will auto-escalate to higher authority. Wait for their approval.

### "Fees not updating to Paid"
**Solution:** Manually mark individual fees as paid from the Fees page.

---

## Future Enhancements

- [ ] Automatic fee marking when payment approved
- [ ] Bulk payment processing
- [ ] Payment reminders and notifications
- [ ] Direct bank integration
- [ ] Receipt generation and emailing
- [ ] Payment schedule setup
- [ ] Installment payment tracking

---

**Last Updated:** April 16, 2026
**For Support:** Contact your system administrator or refer to the main documentation.
