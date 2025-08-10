
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
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Check if supabase is available
      if (!supabase) {
        throw new Error('Database connection not available. Please configure your Supabase environment variables in the Secrets tool.');
      }
      
      // Fetch products with their localizations, images, and availability
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          status,
          category,
          created_at,
          product_localizations (
            name,
            brand,
            short_description,
            country,
            language
          ),
          product_images (
            image_url,
            is_main
          ),
          product_availability (
            country
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) {
        throw productsError;
      }

      // Transform data to match the component's expected format
      const transformedProducts = productsData.map(product => {
        const mainLocalization = product.product_localizations.find(
          loc => loc.country === 'PH' && loc.language === 'en'
        ) || product.product_localizations[0];

        const mainImage = product.product_images.find(img => img.is_main)?.image_url || 
                         product.product_images[0]?.image_url || 
                         "/placeholder.svg?height=40&width=40";

        const availableCountries = [...new Set(product.product_availability.map(av => av.country))];

        return {
          id: product.id,
          name: mainLocalization?.name || 'Unnamed Product',
          brand: mainLocalization?.brand || 'Unknown Brand',
          category: product.category || 'Uncategorized',
          status: product.status || 'draft',
          prices: 0, // You can add price counting logic later
          countries: availableCountries,
          image: mainImage,
          createdAt: new Date(product.created_at).toLocaleDateString(),
          slug: product.slug,
        };
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
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle product deletion
  const handleDeleteProduct = async (productId, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\nThis will permanently remove the product and all its related data (images, specifications, etc.). This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setLoading(true);
      
      // Check if supabase is available
      if (!supabase) {
        throw new Error('Database connection not available. Please check your environment variables.');
      }

      // Delete all related records first due to foreign key constraints
      const deletePromises = [
        supabase.from('product_localizations').delete().eq('product_id', productId),
        supabase.from('product_images').delete().eq('product_id', productId),
        supabase.from('product_specifications').delete().eq('product_id', productId),
        supabase.from('product_availability').delete().eq('product_id', productId)
      ];

      // Execute all deletions in parallel
      const deleteResults = await Promise.all(deletePromises);
      
      // Check if any of the related deletions failed
      const hasError = deleteResults.some(result => result.error);
      if (hasError) {
        const errors = deleteResults.filter(result => result.error).map(result => result.error.message);
        throw new Error(`Failed to delete related data: ${errors.join(', ')}`);
      }

      // Now delete the main product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (productError) throw productError;

      // Show success message
      alert(`Product "${productName}" has been deleted successfully.`);
      
      // Refresh the products list
      await fetchProducts();
      
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Failed to delete product "${productName}": ${error.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading products: {error}</p>
        <Button 
          onClick={fetchProducts} 
          className="mt-4 bg-white text-black hover:bg-gray-200"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Products
          </h1>
          <p className="text-gray-400">
            Manage all products in your price comparison platform
          </p>
        </div>
        {/* Add Product Button */}
        <Link href="/admin/products/new-product">
          <Button className="bg-white text-black hover:bg-gray-200 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* All Products Table Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Products ({products.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Manage products, their details, and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
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
              Filter
            </Button>
            <Button
              onClick={fetchProducts}
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Refresh
            </Button>
          </div>

          {/* Products Table */}
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Product</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Prices</TableHead>
                  <TableHead className="text-gray-300">Countries</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      className="text-center py-8 text-gray-400"
                    >
                      {searchTerm ? 'No products found matching your search.' : 'No products found. Add your first product!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-gray-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=40&width=40";
                            }}
                          />
                          <div>
                            <div className="font-medium text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.category}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            product.status === "published"
                              ? "bg-green-900 text-green-300"
                              : "bg-yellow-900 text-yellow-300"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.prices}
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
                      <TableCell>
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
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                              <Globe className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
