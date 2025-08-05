// components/product/BasicInfoTab.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function BasicInfoTab({
  productData,
  setProductData,
  localizationData,
  setLocalizationData,
  specifications,
  setSpecifications,
  handleNameChange,
}) {
  // Local state for adding new specifications
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const availableCountries = [
    { code: "CA", name: "Canada" },
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
  ];

  // Function to add a new specification
  const handleAddSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setSpecifications((prev) => [
        ...prev,
        { key: newSpec.key, value: newSpec.value },
      ]);
      setNewSpec({ key: "", value: "" });
    }
  };

  // Function to remove a specification by index
  const handleRemoveSpecification = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Product Information</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the basic details about the product and its localization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-gray-300">
            Product Slug (URL)
          </Label>
          <Input
            id="slug"
            placeholder="product-name-in-url"
            value={productData.slug}
            onChange={(e) =>
              setProductData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500">
            This will appear in the product URL (e.g., /products/your-slug).
          </p>
        </div>

        <Separator className="bg-gray-800" />

        {/* Country and Language Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-300">
              Country *
            </Label>
            <Select
              value={localizationData.country}
              onValueChange={(value) =>
                setLocalizationData((prev) => ({ ...prev, country: value }))
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {availableCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-gray-300">
              Language *
            </Label>
            <Select
              value={localizationData.language}
              onValueChange={(value) =>
                setLocalizationData((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Name and Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Product Name *
            </Label>
            <Input
              id="name"
              placeholder="iPhone 15 Pro Max"
              value={localizationData.name}
              onChange={(e) => handleNameChange(e.target.value)}
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
              value={localizationData.brand}
              onChange={(e) =>
                setLocalizationData((prev) => ({
                  ...prev,
                  brand: e.target.value,
                }))
              }
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-300">
            Category *
          </Label>
          <Select
            value={localizationData.category}
            onValueChange={(value) =>
              setLocalizationData((prev) => ({ ...prev, category: value }))
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

        {/* Descriptions */}
        <div className="space-y-2">
          <Label htmlFor="shortDescription" className="text-gray-300">
            Short Description
          </Label>
          <Textarea
            id="shortDescription"
            placeholder="Brief description for product listings"
            value={localizationData.short_description}
            onChange={(e) =>
              setLocalizationData((prev) => ({
                ...prev,
                short_description: e.target.value,
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
            value={localizationData.long_description}
            onChange={(e) =>
              setLocalizationData((prev) => ({
                ...prev,
                long_description: e.target.value,
              }))
            }
            className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
          />
          <p className="text-xs text-gray-500">
            You can use markdown formatting for rich text.
          </p>
        </div>

        <Separator className="bg-gray-800" />

        {/* Specifications Section */}
        <div className="space-y-4">
          <Label className="text-gray-300">
            Specifications (product_specifications table)
          </Label>
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
                  setNewSpec((prev) => ({ ...prev, value: e.target.value }))
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
          {specifications.length > 0 && (
            <div className="space-y-2">
              {specifications.map((spec, index) => (
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
  );
}
