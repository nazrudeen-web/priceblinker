"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Sample product data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    status: "published",
    prices: 12,
    countries: ["US", "CA"],
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    status: "published",
    prices: 8,
    countries: ["US"],
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "MacBook Air M3",
    brand: "Apple",
    category: "Laptops",
    status: "draft",
    prices: 0,
    countries: ["US", "CA"],
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    status: "published",
    prices: 6,
    countries: ["US", "CA"],
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-12",
  },
];

// Products management page
export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Link href="/admin/products/new">
          <Button className="bg-white text-black hover:bg-gray-200 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* All Products Table Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Products</CardTitle>
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
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
                        {product.countries.map((country) => (
                          <Badge
                            key={country}
                            variant="outline"
                            className="text-xs border-gray-600 text-gray-400"
                          >
                            {country}
                          </Badge>
                        ))}
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
                          <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
