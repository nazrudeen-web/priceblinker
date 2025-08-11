
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Globe,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ProductService } from "@/services/productService";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const productsData = await ProductService.getAllProductsWithVariants();

      // Transform data for display
      const transformedProducts = [];

      productsData.forEach(product => {
        product.product_variants.forEach(variant => {
          const mainLocalization = variant.product_variant_localizations.find(
            loc => loc.country === 'PH' && loc.language === 'en'
          ) || variant.product_variant_localizations[0];

          const mainImage = variant.product_variant_images.find(img => img.is_main) 
                           || variant.product_variant_images[0];

          // Get countries from product availability
          const availableCountries = product.product_availability.map(av => av.country);

          // Get latest prices
          const prices = variant.product_prices || [];
          const latestPrice = prices.length > 0 ? prices[0] : null;

          transformedProducts.push({
            id: variant.id,
            productId: product.id,
            name: mainLocalization?.name || 'Unnamed Product',
            brand: mainLocalization?.brand || 'Unknown Brand',
            category: product.category || 'Uncategorized',
            status: variant.status,
            sku: variant.sku,
            slug: variant.slug,
            color: variant.color,
            storage: variant.storage,
            ram: variant.ram,
            image: mainImage?.image_url,
            price: latestPrice ? `${latestPrice.currency} ${latestPrice.price}` : 'No price',
            countries: availableCountries,
            createdAt: new Date(variant.created_at).toLocaleDateString(),
            shortDescription: mainLocalization?.short_description || '',
          });
        });
      });

      setProducts(transformedProducts);

    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (variantId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await ProductService.deleteProductVariant(variantId);
      alert(`Product variant "${productName}" has been deleted successfully.`);
      
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product variant:', error);
      alert(`Failed to delete product variant: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-400">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Products</h1>
            <p className="text-gray-400">Manage all product variants in your price comparison platform</p>
          </div>
          <Link href="/admin/products/new-product">
            <Button className="bg-white text-black hover:bg-gray-200 cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
        
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <p className="text-red-400">Error loading products: {error}</p>
            <Button 
              onClick={fetchProducts} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Product Variants
          </h1>
          <p className="text-gray-400">
            Manage all product variants in your price comparison platform
          </p>
        </div>
        {/* Add Product Button */}
        <Link href="/admin/products/new-product">
          <Button className="bg-white text-black hover:bg-gray-200 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Product Variant
          </Button>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Search & Filter</CardTitle>
          <CardDescription className="text-gray-400">
            Find and manage your product variants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            Product Variants ({filteredProducts.length})
          </CardTitle>
          <CardDescription className="text-gray-400">
            All product variants with their details and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No product variants found.</p>
              <Link href="/admin/products/new-product">
                <Button className="mt-4 bg-white text-black hover:bg-gray-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Product Variant
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Product</TableHead>
                  <TableHead className="text-gray-400">Variant</TableHead>
                  <TableHead className="text-gray-400">SKU</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Price</TableHead>
                  <TableHead className="text-gray-400">Countries</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="text-sm">
                        {product.color && <div>Color: {product.color}</div>}
                        {product.storage && <div>Storage: {product.storage}</div>}
                        {product.ram && <div>RAM: {product.ram}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="capitalize border-gray-600 text-gray-400"
                      >
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "active" ? "default" : "secondary"}
                        className={
                          product.status === "active"
                            ? "bg-green-900 text-green-300 border-green-800"
                            : "bg-gray-700 text-gray-300 border-gray-600"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {product.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.countries.length > 0 ? (
                          product.countries.map((country) => (
                            <Badge
                              key={country}
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-400"
                            >
                              {country}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No countries</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {product.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-gray-800 border-gray-700"
                        >
                          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 hover:bg-red-900/50 cursor-pointer"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
