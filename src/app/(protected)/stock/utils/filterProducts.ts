import { Product } from "@/types";

export function filterProducts(
  products: Product[],
  searchTerm: string,
  statusFilter: string
): Product[] {
  return products.filter((product) => {
    // Filtro por pesquisa
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Filtro por status
    if (statusFilter === "all") return true;

    const quantity = product.quantity;
    const minStock = product.minStock;

    switch (statusFilter) {
      case "low":
        return quantity <= minStock;
      case "medium":
        return quantity > minStock && quantity <= minStock * 2;
      case "ok":
        return quantity > minStock * 2;
      default:
        return true;
    }
  });
} 