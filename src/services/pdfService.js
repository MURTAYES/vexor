const React = require('react');
const { Document, Page, View, Text, StyleSheet, renderToBuffer, Font } = require('@react-pdf/renderer');

// Register no custom fonts — Helvetica is built-in and guaranteed

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#000000',
  },
  // Header
  headerBar: {
    backgroundColor: '#000000',
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#FF5500',
    letterSpacing: 4,
  },
  invoiceLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  // Customer section
  customerSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F2F2F2',
    border: '1px solid #E5E5E5',
  },
  customerTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 1,
    color: '#595959',
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  customerLabel: {
    width: 60,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#595959',
  },
  customerValue: {
    flex: 1,
    fontSize: 10,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: 8,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #E5E5E5',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #E5E5E5',
    backgroundColor: '#F2F2F2',
  },
  tableCell: {
    fontSize: 10,
  },
  // Column widths
  colItem: { width: '35%' },
  colSize: { width: '12%', textAlign: 'center' },
  colQty: { width: '12%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colSubtotal: { width: '21%', textAlign: 'right' },
  // Special instruction box (PDF-02, PDF-03)
  specialInstructionBox: {
    backgroundColor: '#FFFDE7',
    borderLeft: '3px solid #FF5500',
    padding: 8,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 10,
  },
  specialInstructionLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#FF5500',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  specialInstructionText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#333333',
  },
  // Totals
  totalsSection: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    width: 200,
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#595959',
    width: 100,
  },
  totalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'right',
    width: 100,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    width: 200,
    borderTop: '2px solid #000000',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#000000',
    width: 100,
  },
  grandTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: '#FF5500',
    textAlign: 'right',
    width: 100,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#595959',
    borderTop: '1px solid #E5E5E5',
    paddingTop: 10,
  },
});

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount) => `৳${Number(amount).toLocaleString('en-IN')}`;

const InvoiceDocument = ({ order }) => {
  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header bar
      React.createElement(View, { style: styles.headerBar },
        React.createElement(Text, { style: styles.shopName }, 'VEXOR'),
        React.createElement(View, null,
          React.createElement(Text, { style: styles.invoiceLabel }, 'INVOICE'),
          React.createElement(Text, { style: styles.invoiceNumber }, order.invoice_number),
          React.createElement(Text, { style: styles.invoiceLabel }, formatDate(order.createdAt))
        )
      ),

      // Customer section
      React.createElement(View, { style: styles.customerSection },
        React.createElement(Text, { style: styles.customerTitle }, 'Customer Details'),
        React.createElement(View, { style: styles.customerRow },
          React.createElement(Text, { style: styles.customerLabel }, 'Name:'),
          React.createElement(Text, { style: styles.customerValue }, order.customer_name)
        ),
        React.createElement(View, { style: styles.customerRow },
          React.createElement(Text, { style: styles.customerLabel }, 'Phone:'),
          React.createElement(Text, { style: styles.customerValue }, order.customer_phone)
        ),
        order.customer_email ? React.createElement(View, { style: styles.customerRow },
          React.createElement(Text, { style: styles.customerLabel }, 'Email:'),
          React.createElement(Text, { style: styles.customerValue }, order.customer_email)
        ) : null
      ),

      // Table header
      React.createElement(View, { style: styles.tableHeader },
        React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colItem } }, 'Item'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colSize } }, 'Size'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colQty } }, 'Qty'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colPrice } }, 'Unit Price'),
        React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colSubtotal } }, 'Subtotal')
      ),

      // Table rows
      ...order.line_items.map((item, idx) => {
        const lineTotal = item.snapshot_price * item.quantity;
        const rowStyle = idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt;

        const elements = [
          React.createElement(View, { style: rowStyle, key: `row-${idx}` },
            React.createElement(Text, { style: { ...styles.tableCell, ...styles.colItem } },
              item.product_name || `Product`
            ),
            React.createElement(Text, { style: { ...styles.tableCell, ...styles.colSize } }, item.size),
            React.createElement(Text, { style: { ...styles.tableCell, ...styles.colQty } }, String(item.quantity)),
            React.createElement(Text, { style: { ...styles.tableCell, ...styles.colPrice } }, formatCurrency(item.snapshot_price)),
            React.createElement(Text, { style: { ...styles.tableCell, ...styles.colSubtotal } }, formatCurrency(lineTotal))
          ),
        ];

        // Special instruction box (PDF-02)
        if (item.special_instruction) {
          elements.push(
            React.createElement(View, { style: styles.specialInstructionBox, key: `si-${idx}` },
              React.createElement(Text, { style: styles.specialInstructionLabel }, 'Special Instructions'),
              React.createElement(Text, { style: styles.specialInstructionText }, item.special_instruction)
            )
          );
        }

        return elements;
      }).flat(),

      // Totals
      React.createElement(View, { style: styles.totalsSection },
        React.createElement(View, { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, 'Subtotal'),
          React.createElement(Text, { style: styles.totalValue }, formatCurrency(order.subtotal))
        ),
        React.createElement(View, { style: styles.grandTotalRow },
          React.createElement(Text, { style: styles.grandTotalLabel }, 'Total'),
          React.createElement(Text, { style: styles.grandTotalValue }, formatCurrency(order.total))
        )
      ),

      // Footer
      React.createElement(Text, { style: styles.footer }, 'Thank you for your purchase! — VEXOR')
    )
  );
};

/**
 * Generate a PDF invoice buffer from an Order document.
 * @param {Object} order - Mongoose Order document (populated with line_items)
 * @returns {Promise<Buffer>} PDF file buffer
 */
const generateInvoicePDF = async (order) => {
  const element = React.createElement(InvoiceDocument, { order });
  const buffer = await renderToBuffer(element);
  return buffer;
};

module.exports = { generateInvoicePDF };
