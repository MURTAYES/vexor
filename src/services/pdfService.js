const React = require('react');
const { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } = require('@react-pdf/renderer');
const path = require('path');

// Resolve the logo path to logo.png
const LOGO_PATH = path.resolve(__dirname, '../../frontend/src/assets/logo.png');

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },

  // Helpers for brutalist shadows
  shadow8: {
    backgroundColor: '#000000',
    paddingRight: 8,
    paddingBottom: 8,
    marginBottom: 24,
  },
  shadow4: {
    backgroundColor: '#E5E5E5',
    paddingRight: 4,
    paddingBottom: 4,
    marginBottom: 24,
  },
  shadow4Black: {
    backgroundColor: '#000000',
    paddingRight: 4,
    paddingBottom: 4,
    marginBottom: 24,
  },

  // 1. Header Box
  headerBox: {
    backgroundColor: '#FFFFFF',
    border: '4px solid #000000',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logoContainer: {
    width: 140,
    marginBottom: 16,
  },
  logoImage: {
    width: '100%',
  },
  invoiceTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textTransform: 'uppercase',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  txnBadge: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headerMetaText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#595959', // text-secondary
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  // 2. Customer Info (Bill To)
  customerBox: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #000000',
    padding: 24,
  },
  customerBadge: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  customerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  customerDetail: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#595959',
    marginBottom: 4,
  },
  customerDivider: {
    borderTop: '1px solid #E5E5E5',
    marginTop: 8,
    paddingTop: 8,
  },
  customerAccount: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#000000',
    textTransform: 'uppercase',
  },

  // 3. Line Items Table
  tableBox: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #000000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9', // surface-neutral
    borderBottom: '1px solid #E5E5E5',
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 10,
    color: '#000000',
  },
  tableCellBold: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    textTransform: 'uppercase',
  },
  
  // Columns Widths
  colSku: { width: '20%' },
  colItem: { width: '35%' },
  colSize: { width: '10%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '12%', textAlign: 'right' },
  colTotal: { width: '13%', textAlign: 'right' },

  // Instruction Box in Table
  instructionRow: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    padding: 12,
    paddingLeft: 16,
  },
  instructionText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#595959',
  },
  instructionLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#FF5500',
  },

  // 4. Totals & Notes Section (Flex Row)
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notesBox: {
    width: '58%',
    backgroundColor: '#FAFAFA',
    border: '2px dashed #000000',
    padding: 24,
  },
  notesTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  notesContent: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#595959',
    lineHeight: 1.5,
    textTransform: 'uppercase',
  },
  calcContainer: {
    width: '38%',
  },
  calcBox: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #000000',
    padding: 24,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calcLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#595959',
  },
  calcValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#595959',
  },
  calcLabelDark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#000000',
  },
  calcValueDark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#000000',
  },
  grandTotalDivider: {
    borderTop: '4px solid #000000',
    marginTop: 8,
    paddingTop: 16,
  },
  grandTotalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 8,
  },
  grandTotalValue: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 24,
    color: '#FF5500', // vexor-orange
  }
});

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const formatCurrency = (amount) => `৳${Number(amount).toLocaleString('en-IN')}`;

const InvoiceDocument = ({ order }) => {
  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },

      // 1. Header block
      React.createElement(View, { style: styles.shadow8 },
        React.createElement(View, { style: styles.headerBox },
          React.createElement(View, null,
            React.createElement(View, { style: styles.logoContainer },
              React.createElement(Image, { src: LOGO_PATH, style: styles.logoImage })
            ),
            React.createElement(Text, { style: styles.invoiceTitle }, 'INVOICE')
          ),
          React.createElement(View, { style: styles.headerRight },
            React.createElement(Text, { style: styles.txnBadge }, `TXN: #${order.invoice_number}`),
            React.createElement(Text, { style: styles.headerMetaText }, `ISSUED: ${formatDate(order.createdAt)}`),
            // Assuming due date is same as issued date for this ERP since it's instant POS
            React.createElement(Text, { style: styles.headerMetaText }, `DUE DATE: ${formatDate(order.createdAt)}`)
          )
        )
      ),

      // 2. Customer Info (Bill To)
      React.createElement(View, { style: styles.shadow4 },
        React.createElement(View, { style: styles.customerBox },
          React.createElement(Text, { style: styles.customerBadge }, 'CUSTOMER DETAILS:'),
          React.createElement(Text, { style: styles.customerName }, order.customer_name),
          React.createElement(Text, { style: styles.customerDetail }, order.customer_phone),
          order.customer_email ? React.createElement(Text, { style: styles.customerDetail }, order.customer_email) : null,
          React.createElement(View, { style: styles.customerDivider },
            React.createElement(Text, { style: styles.customerAccount }, 'ACCOUNT: #GUEST')
          )
        )
      ),

      // 3. Line Items
      React.createElement(View, { style: styles.shadow4 },
        React.createElement(View, { style: styles.tableBox },
          React.createElement(View, { style: styles.tableHeader },
            React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colSku } }, 'SKU'),
            React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colItem } }, 'PRODUCT NAME'),
            React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colSize } }, 'SIZE'),
            React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colQty } }, 'QTY'),
            React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colPrice } }, 'UNIT PRICE'),
            React.createElement(Text, { style: { ...styles.tableHeaderCell, ...styles.colTotal } }, 'TOTAL')
          ),
          
          ...order.line_items.map((item, idx) => {
            const lineTotal = item.snapshot_price * item.quantity;
            const rowStyle = idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt;

            const elements = [
              React.createElement(View, { style: rowStyle, key: `row-${idx}` },
                // Just extracting a pseudo SKU if actual isn't strictly available, or using item._id
                React.createElement(Text, { style: { ...styles.tableCellBold, ...styles.colSku } }, String(item.sku_id || `VEX-${idx+1}`).slice(-8).toUpperCase()),
                React.createElement(Text, { style: { ...styles.tableCellBold, ...styles.colItem } }, item.product_name || `JERSEY`),
                React.createElement(Text, { style: { ...styles.tableCell, ...styles.colSize } }, item.size),
                React.createElement(Text, { style: { ...styles.tableCell, ...styles.colQty } }, String(item.quantity).padStart(2, '0')),
                React.createElement(Text, { style: { ...styles.tableCell, ...styles.colPrice } }, formatCurrency(item.snapshot_price)),
                React.createElement(Text, { style: { ...styles.tableCellBold, ...styles.colTotal } }, formatCurrency(lineTotal))
              )
            ];

            if (item.special_instruction) {
              elements.push(
                React.createElement(View, { style: styles.instructionRow, key: `si-${idx}` },
                  React.createElement(Text, { style: styles.instructionText }, 
                    React.createElement(Text, { style: styles.instructionLabel }, 'NOTE: '), 
                    item.special_instruction
                  )
                )
              );
            }
            return elements;
          }).flat()
        )
      ),

      // 4. Totals & Notes
      React.createElement(View, { style: styles.bottomSection },
        // Notes
        React.createElement(View, { style: styles.notesBox },
          React.createElement(Text, { style: styles.notesTitle }, 'NOTES / TERMS:'),
          React.createElement(Text, { style: styles.notesContent }, 
            'All returns must be processed within 14 days of delivery. ' +
            'Subject to a 15% restocking fee on bulk orders. ' +
            'Thank you for choosing Vexor for your high-performance needs.'
          )
        ),
        // Calculation Column
        React.createElement(View, { style: styles.calcContainer },
          React.createElement(View, { style: styles.shadow4 },
            React.createElement(View, { style: styles.calcBox },
              React.createElement(View, { style: styles.calcRow },
                React.createElement(Text, { style: styles.calcLabelDark }, 'SUBTOTAL'),
                React.createElement(Text, { style: styles.calcValueDark }, formatCurrency(order.subtotal))
              ),
              React.createElement(View, { style: styles.calcRow },
                React.createElement(Text, { style: styles.calcLabel }, 'TAX (0%)'),
                React.createElement(Text, { style: styles.calcValue }, '৳0')
              ),
              React.createElement(View, { style: styles.calcRow },
                React.createElement(Text, { style: styles.calcLabel }, 'SHIPPING'),
                React.createElement(Text, { style: styles.calcValue }, '৳0')
              ),
              React.createElement(View, { style: styles.grandTotalDivider },
                React.createElement(Text, { style: styles.grandTotalLabel }, 'GRAND TOTAL'),
                React.createElement(Text, { style: styles.grandTotalValue }, formatCurrency(order.total))
              )
            )
          )
        )
      )
    )
  );
};

const generateInvoicePDF = async (order) => {
  const element = React.createElement(InvoiceDocument, { order });
  const buffer = await renderToBuffer(element);
  return buffer;
};

module.exports = { generateInvoicePDF };
