import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    const { name, description, quantity, price, image } = newProduct;

    if (!name || !description || !quantity || !price || !image) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
	  formData.append("description", description);
	  formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("image", image); // This should be a File object

      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData, // Don't set Content-Type header — the browser will handle it
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to create product." };
      }

      set((state) => ({ products: [...state.products, data.product] }));

      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.error("Create product error:", error);
      return { success: false, message: "Something went wrong." };
    }
  },

  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },

  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
    const data = await res.json();

    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));

    return { success: true, message: data.message };
  },

  updateProduct: async (pid, updatedProduct) => {
	const isFormData = updatedProduct instanceof FormData;
  
	const res = await fetch(`/api/products/${pid}`, {
	  method: "PUT",
	  body: isFormData ? updatedProduct : JSON.stringify(updatedProduct),
	  headers: isFormData ? undefined : { "Content-Type": "application/json" },
	});
  
	const data = await res.json();
	if (!data.success) return { success: false, message: data.message };
  
	set((state) => ({
	  products: state.products.map((product) => (product._id === pid ? data.data : product)),
	}));
  
	return { success: true, message: data.message };
  },
  
}));
