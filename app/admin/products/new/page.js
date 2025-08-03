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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Eye,
  Upload,
  Plus,
  X,
  ArrowLeft,
  Globe,
  FileText,
  Settings,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

// New Product Page component
export default function NewProductPage() {
  // State to hold product data
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    category: "",
    shortDescription: "",
    longDescription: "",
    status: "draft",
    countries: [], // Array to store selected countries
    specifications: [], // Array of objects for specifications
    images: [], // Array of image URLs
  });

  const [imageUrl, setImageUrl] = useState(""); // for URL input

  // State for new specification input fields
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  // Function to add a new specification
  const handleAddSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setProductData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { ...newSpec }],
      }));
      setNewSpec({ key: "", value: "" }); // Clear input fields after adding
    }
  };

  // Function to remove a specification by index
  const handleRemoveSpecification = (index) => {
    setProductData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Function to toggle country availability
  const handleCountryToggle = (country) => {
    setProductData((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country) // Remove if already present
        : [...prev.countries, country], // Add if not present
    }));
  };

  // Function to handle saving product (as draft or published)
  const handleSave = (status) => {
    setProductData((prev) => ({ ...prev, status })); // Update status before saving
    // In a real application, you would send this data to your backend API
    console.log("Saving product:", { ...productData, status });
    // You might also show a success message or redirect
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Add New Product
            </h1>
            <p className="text-gray-400">
              Create a new product for price comparison
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSave("draft")}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-200 cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSave("published")}
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Tabs for Product Information */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 ">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Globe className="mr-2 h-4 w-4" />
            Availability
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab Content */}
        <TabsContent value="basic" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the basic details about the product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="iPhone 15 Pro Max"
                    value={productData.name}
                    onChange={(e) =>
                      setProductData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-gray-300">
                    Brand *
                  </Label>
                  <Input
                    id="brand"
                    placeholder="Apple"
                    value={productData.brand}
                    onChange={(e) =>
                      setProductData((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">
                  Category *
                </Label>
                <Select
                  value={productData.category}
                  onValueChange={(value) =>
                    setProductData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="smartphones">Smartphones</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="headphones">Headphones</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-gray-300">
                  Short Description
                </Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Brief description for product listings"
                  value={productData.shortDescription}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      shortDescription: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longDescription" className="text-gray-300">
                  Long Description (Markdown)
                </Label>
                <Textarea
                  id="longDescription"
                  placeholder="Detailed product description with markdown support..."
                  value={productData.longDescription}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      longDescription: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
                />
                <p className="text-xs text-gray-500">
                  You can use markdown formatting for rich text
                </p>
              </div>
              <Separator className="bg-gray-800" />

              {/* Specifications Section */}
              <div className="space-y-4">
                <Label className="text-gray-300">Specifications</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Specification name (e.g., RAM)"
                    value={newSpec.key}
                    onChange={(e) =>
                      setNewSpec((prev) => ({ ...prev, key: e.target.value }))
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Value (e.g., 8GB)"
                      value={newSpec.value}
                      onChange={(e) =>
                        setNewSpec((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      onClick={handleAddSpecification}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {productData.specifications.length > 0 && (
                  <div className="space-y-2">
                    {productData.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-800 p-3 rounded"
                      >
                        <span className="text-white">
                          <strong>{spec.key}:</strong> {spec.value}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSpecification(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab Content */}
        <TabsContent value="details" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">SEO Information</CardTitle>
              <CardDescription className="text-gray-400">
                Improve your product’s search engine visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SEO Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-gray-300">
                  Product Slug (URL)
                </Label>
                <Input
                  id="slug"
                  placeholder="product-name-in-url"
                  value={productData.slug}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500">
                  This will appear in the product URL (e.g.,
                  /products/your-slug)
                </p>
              </div>

              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-gray-300">
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  placeholder="Product Title for SEO"
                  value={productData.metaTitle}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500">
                  Appears as the title in Google search results
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-gray-300">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Short summary for search engines..."
                  value={productData.metaDescription}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  This text will appear in the search snippet
                </p>
              </div>

              {/* Canonical URL */}
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl" className="text-gray-300">
                  Canonical URL (optional)
                </Label>
                <Input
                  id="canonicalUrl"
                  placeholder="https://example.com/product-original"
                  value={productData.canonicalUrl}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500">
                  If this product exists on another site, add its original URL
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab Content */}
        <TabsContent value="images" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Product Images</CardTitle>
              <CardDescription className="text-gray-400">
                Upload and manage product images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload URL Area */}
              <div className="mt-6">
                <label className="text-gray-300 block mb-2">
                  Add Image by URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
                  />
                  <Button
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={() => {
                      if (!imageUrl) return;
                      setProductData((prev) => ({
                        ...prev,
                        images: [...prev.images, imageUrl],
                      }));
                      setImageUrl(""); // clear input
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300 mb-2">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
                <div className="relative inline-block">
                  <Button className="mt-4 bg-white text-black hover:bg-gray-200">
                    Choose Files
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;

                      const fileUrls = Array.from(files).map((file) =>
                        URL.createObjectURL(file)
                      );

                      setProductData((prev) => ({
                        ...prev,
                        images: [...prev.images, ...fileUrls],
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Display Uploaded Images (if any) */}
              {productData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {productData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded border border-gray-700"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProductData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab Content */}
        <TabsContent value="availability" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Country Availability</CardTitle>
              <CardDescription className="text-gray-400">
                Select which countries this product is available in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Country Toggles */}
              <div className="grid grid-cols-2 gap-4">
                {["US", "CA", "UK", "AU"].map((country) => (
                  <div
                    key={country}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {/* Placeholder for flag icon */}
                      <img
                        src={`https://flagcdn.com/w40/${
                          country === "UK" ? "gb" : country.toLowerCase()
                        }.png`}
                        alt={`${country} flag`}
                        className="w-6 h-4 object-cover rounded"
                      />
                      <span className="text-white">
                        {country === "US"
                          ? "United States"
                          : country === "CA"
                          ? "Canada"
                          : country === "UK"
                          ? "United Kingdom"
                          : "Australia"}
                      </span>
                    </div>
                    <Switch
                      checked={productData.countries.includes(country)}
                      onCheckedChange={() => handleCountryToggle(country)}
                    />
                  </div>
                ))}
              </div>

              {/* Display Selected Countries */}
              {productData.countries.length > 0 && (
                <div className="mt-4">
                  <Label className="text-gray-300">Selected Countries:</Label>
                  <div className="flex gap-2 mt-2">
                    {productData.countries.map((country) => (
                      <Badge
                        key={country}
                        className="bg-blue-900 text-blue-300"
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
