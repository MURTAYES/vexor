import { create } from 'zustand';

const useInvoiceStore = create((set) => ({
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  line_items: [],
  
  setCustomerDetails: (details) => set((state) => ({ ...state, ...details })),
  
  addItem: (item) => set((state) => {
    // If the exact same SKU is added, just increment quantity
    const existingIndex = state.line_items.findIndex(i => i.sku_id === item.sku_id);
    if (existingIndex >= 0) {
      const newItems = [...state.line_items];
      // Bound it by the stock available (checked in UI before calling, but safe here too)
      newItems[existingIndex].quantity += item.quantity;
      return { line_items: newItems };
    }
    return { line_items: [...state.line_items, item] };
  }),
  
  removeItem: (skuId) => set((state) => ({
    line_items: state.line_items.filter(i => i.sku_id !== skuId)
  })),
  
  updateItemQuantity: (skuId, quantity) => set((state) => ({
    line_items: state.line_items.map(i => i.sku_id === skuId ? { ...i, quantity } : i)
  })),
  
  clearInvoice: () => set({ customer_name: '', customer_phone: '', customer_email: '', line_items: [] }),
}));

export default useInvoiceStore;
