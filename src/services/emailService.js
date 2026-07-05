const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

// Initialize transporter only if SMTP credentials are configured
const initTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn('SMTP not configured — email dispatch disabled. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    pool: true, // Persistent SMTP connections
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  logger.info({ host: SMTP_HOST, port: SMTP_PORT }, 'SMTP transporter initialized');
  return transporter;
};

/**
 * Build the Brutalist-themed HTML email body for an invoice.
 */
const buildEmailHTML = (order) => {
  const lineItemsHTML = order.line_items.map(item => {
    const lineTotal = item.snapshot_price * item.quantity;
    let row = `
      <tr style="border-bottom: 1px solid #E5E5E5;">
        <td style="padding: 10px; font-size: 14px;">${item.product_name || 'Product'}</td>
        <td style="padding: 10px; text-align: center; font-size: 14px;">${item.size}</td>
        <td style="padding: 10px; text-align: center; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; font-size: 14px;">৳${item.snapshot_price}</td>
        <td style="padding: 10px; text-align: right; font-size: 14px; font-weight: bold;">৳${lineTotal}</td>
      </tr>`;

    if (item.special_instruction) {
      row += `
      <tr>
        <td colspan="5" style="padding: 4px 10px 10px 20px;">
          <div style="background-color: #FFFDE7; border-left: 3px solid #FF5500; padding: 8px 12px;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #FF5500; letter-spacing: 0.5px;">Special Instructions</span><br/>
            <span style="font-size: 13px; font-style: italic; color: #333333;">${item.special_instruction}</span>
          </div>
        </td>
      </tr>`;
    }

    return row;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #F2F2F2; font-family: Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;">
    <!-- Header -->
    <tr>
      <td style="background-color: #000000; padding: 20px 30px;">
        <table width="100%">
          <tr>
            <td><span style="font-size: 28px; font-weight: bold; color: #FF5500; letter-spacing: 4px;">VEXOR</span></td>
            <td style="text-align: right;">
              <span style="font-size: 10px; color: #FFFFFF; text-transform: uppercase;">Invoice</span><br/>
              <span style="font-size: 16px; font-weight: bold; color: #FFFFFF;">${order.invoice_number}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 30px;">
        <p style="font-size: 16px; margin: 0 0 20px 0;">Hi <strong>${order.customer_name}</strong>,</p>
        <p style="font-size: 14px; color: #595959; margin: 0 0 24px 0;">Your invoice is attached as a PDF. Here's a summary:</p>

        <!-- Line Items Table -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr style="background-color: #000000;">
            <th style="padding: 10px; color: #FFFFFF; font-size: 11px; text-transform: uppercase; text-align: left; letter-spacing: 0.5px;">Item</th>
            <th style="padding: 10px; color: #FFFFFF; font-size: 11px; text-transform: uppercase; text-align: center;">Size</th>
            <th style="padding: 10px; color: #FFFFFF; font-size: 11px; text-transform: uppercase; text-align: center;">Qty</th>
            <th style="padding: 10px; color: #FFFFFF; font-size: 11px; text-transform: uppercase; text-align: right;">Price</th>
            <th style="padding: 10px; color: #FFFFFF; font-size: 11px; text-transform: uppercase; text-align: right;">Subtotal</th>
          </tr>
          ${lineItemsHTML}
        </table>

        <!-- Total -->
        <table width="100%" style="margin-top: 20px;">
          <tr>
            <td style="text-align: right; padding: 12px 10px; border-top: 3px solid #000000;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #595959;">Total</span>
              <span style="font-size: 24px; font-weight: bold; color: #FF5500; margin-left: 16px;">৳${order.total}</span>
            </td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #595959; margin-top: 30px;">Thank you for your purchase!</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #F2F2F2; padding: 16px 30px; text-align: center; font-size: 11px; color: #595959; border-top: 1px solid #E5E5E5;">
        VEXOR — Football Jersey Retail
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Send an invoice email with PDF attachment. Fire-and-forget — never throws.
 * Updates order.email_sent_at on success, order.email_error on failure.
 *
 * @param {Object} order - Mongoose Order document
 * @param {Buffer} pdfBuffer - PDF file buffer
 */
const sendInvoiceEmail = async (order, pdfBuffer) => {
  try {
    const transport = initTransporter();
    if (!transport) {
      logger.info({ invoice: order.invoice_number }, 'Email skipped — SMTP not configured');
      return;
    }

    if (!order.customer_email) {
      logger.info({ invoice: order.invoice_number }, 'Email skipped — no customer email');
      return;
    }

    const filename = `vexor-invoice-${order.invoice_number}.pdf`;

    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: order.customer_email,
      subject: `Your Invoice ${order.invoice_number} — VEXOR`,
      html: buildEmailHTML(order),
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    // Persist success (ORD-08)
    order.email_sent_at = new Date();
    order.email_error = undefined;
    await order.save();

    logger.info({ invoice: order.invoice_number, to: order.customer_email }, 'Invoice email sent');
  } catch (error) {
    // Persist failure (ORD-08) — never throw
    try {
      order.email_error = error.message;
      await order.save();
    } catch (saveErr) {
      logger.error({ err: saveErr }, 'Failed to persist email error to order');
    }
    logger.error({ err: error, invoice: order.invoice_number }, 'Failed to send invoice email');
  }
};

module.exports = { sendInvoiceEmail };
