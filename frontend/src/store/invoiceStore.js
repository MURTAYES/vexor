import { create } from 'zustand';

const useInvoiceStore = create((set) => ({
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  line_items: [],
  
  setCustomerDetails: (details) => set((state) => ({ ...state, ...details })),
  
  addItem: (item) => set((state) => {
    const _localId = item._localId || crypto.randomUUID();
    const printCharge = item.printing?.isPrinted ? (Number(item.printing.charge) || 0) : 0;
    const lineTotal = item.quantity * (item.sellingPrice + printCharge);
    const newItem = { ...item, _localId, lineTotal };
    return { line_items: [...state.line_items, newItem] };
  }),
  
  updateItem: (_localId, changes) => set((state) => {
    return {
      line_items: state.line_items.map(item => {
        if (item._localId === _localId) {
          const updatedItem = { ...item, ...changes };
          if (changes.quantity !== undefined || changes.sellingPrice !== undefined || changes.printing !== undefined) {
            const pc = updatedItem.printing?.isPrinted ? (Number(updatedItem.printing.charge) || 0) : 0;
            updatedItem.lineTotal = updatedItem.quantity * (updatedItem.sellingPrice + pc);
          }
          return updatedItem;
        }
        return item;
      })
    };
  }),

  removeItem: (_localId) => set((state) => ({
    line_items: state.line_items.filter(i => i._localId !== _localId)
  })),
  
  clearInvoice: () => set({ customer_name: '', customer_phone: '', customer_email: '', line_items: [] }),
}));

export default useInvoiceStore;
