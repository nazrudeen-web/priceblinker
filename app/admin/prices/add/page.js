
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductService } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function AddPricePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Price form data
  const [priceData, setPriceData] = useState({
    store_name: "",
    country: "PH",
    price: "",
    currency: "PHP",
    affiliate_link: "",
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await ProductService.getAllProductsWithVariants();
      
      // Transform data for easier searching
      const transformedProducts = [];
      productsData.forEach((product) => {
        product.product_variants.forEach((variant) => {
          const localization = variant.product_variant_localizations?.[0];
          if (localization) {
            transformedProducts.push({
              id: variant.id,
              productId: product.id,
              name: localization.name,
              brand: localization.brand,
              sku: variant.sku,
              color: variant.color,
              storage: variant.storage,
              ram: variant.ram,
              slug: variant.slug,
            });
          }
        });
      });
      
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrice = async () => {
    if (!selectedProduct || !priceData.store_name || !priceData.price) {
      toast({
        title: "Error",
        description: "Please select a product and fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      await ProductService.addPrice({
        product_variant_id: selectedProduct.id,
        ...priceData,
        price: parseFloat(priceData.price),
      });

      toast({
        title: "Success",
        description: "Price added successfully!",
      });

      // Reset form
      setSelectedProduct(null);
      setPriceData({
        store_name: "",
        country: "PH",
        price: "",
        currency: "PHP",
        affiliate_link: "",
      });
      setSearchTerm("");

    } catch (error) {
      console.error("Error saving price:", error);
      toast({
        title: "Error",
        description: "Failed to add price: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Add Price
          </h1>
          <p className="text-gray-400">
            Add a new price for an existing product variant
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Search */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Search Product</CardTitle>
            <CardDescription className="text-gray-400">
              Find the product variant you want to add a price for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? "bg-blue-600 border border-blue-500"
                        : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                    }`}
                  >
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="text-sm text-gray-400">
                      SKU: {product.sku} | Brand: {product.brand}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {product.color && (
                        <Badge variant="outline" className="text-xs">
                          {product.color}
                        </Badge>
                      )}
                      {product.storage && (
                        <Badge variant="outline" className="text-xs">
                          {product.storage}
                        </Badge>
                      )}
                      {product.ram && (
                        <Badge variant="outline" className="text-xs">
                          {product.ram}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Form */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Price Information</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the price details for the selected product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProduct && (
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="font-medium text-white">{selectedProduct.name}</div>
                <div className="text-sm text-gray-400">SKU: {selectedProduct.sku}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Store Name *</Label>
                <Input
                  placeholder="e.g., Lazada, Shopee"
                  value={priceData.store_name}
                  onChange={(e) =>
                    setPriceData((prev) => ({ ...prev, store_name: e.target.value }))
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Country</Label>
                <Select
                  value={priceData.country}
                  onValueChange={(value) =>
                    setPriceData((prev) => ({ ...prev, country: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="PH" className="text-white">
                      Philippines
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Price *</Label>
                <Input
                  type="number"
                  placeholder="e.g., 45000"
                  value={priceData.price}
                  onChange={(e) =>
                    setPriceData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Currency</Label>
                <Select
                  value={priceData.currency}
                  onValueChange={(value) =>
                    setPriceData((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="PHP" className="text-white">
                      PHP
                    </SelectItem>
                    <SelectItem value="USD" className="text-white">
                      USD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Affiliate Link</Label>
              <Input
                type="url"
                placeholder="https://example.com/product"
                value={priceData.affiliate_link}
                onChange={(e) =>
                  setPriceData((prev) => ({ ...prev, affiliate_link: e.target.value }))
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button
              onClick={handleSavePrice}
              disabled={!selectedProduct || saving}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Price
            </Button>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  );
}
