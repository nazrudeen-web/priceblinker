// / components/product/BasicInfoTab.jsx
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
import { Plus, X, Download } from "lucide-react";

export default function BasicInfoTab({
  productData,
  setProductData,
  localizationData,
  setLocalizationData,
  specifications,
  setSpecifications,
  handleNameChange,
  setFetchedData,
  fetchedData,
}) {
  // Local state for adding new specifications
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [sku, setSku] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const availableCountries = [{ code: "PH", name: "Philippines" }];

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

  // Words/phrases to remove from values
  // Patterns to remove globally
  const removePatterns = [
    /\(unlocked\)/gi, // remove "(Unlocked)"
    /\bunlocked\b/gi, // remove "Unlocked"
    /\bunited states\b/gi, // remove "United States"
  ];

  // Function to clean strings recursively in any object/array
  const cleanData = (obj) => {
    if (typeof obj === "string") {
      let cleaned = obj;
      removePatterns.forEach((pattern) => {
        cleaned = cleaned.replace(pattern, "").trim();
      });
      return cleaned.replace(/\s{2,}/g, " "); // remove extra spaces
    } else if (Array.isArray(obj)) {
      return obj.map((item) => cleanData(item));
    } else if (obj && typeof obj === "object") {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = cleanData(obj[key]);
      }
      return newObj;
    }
    return obj;
  };
  const excludeKeywords = [
    "model number",
    "carrier",
    "carrier compatibility",
    "unlocked",
  ];
  const handleFetch = async () => {
    if (!sku) {
      alert("Please enter SKU");
      return;
    }

    console.log("Fetching SKU:", sku);
    setIsFetching(true);
    setFetchedData(null); // reset previous data

    try {
      const apiKey = process.env.NEXT_PUBLIC_BESTBUY_KEY;
      const res = await fetch(
        `https://api.bestbuy.com/v1/products/${sku}.json?apiKey=${apiKey}&format=json&show=sku,name,manufacturer,modelNumber,shortDescription,longDescription,color,details.name,details.value,features.feature,includedItemList.includedItem,images,url`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      let data = await res.json();

      console.log("Data fetched:", data);

      data = cleanData(data);
      setFetchedData(data);

      const featuresText =
        data.features
          ?.map((item) => item.feature)
          .filter(Boolean)
          .join(". ") || "";

      const longDescriptionRaw = [data.longDescription, featuresText]
        .filter(Boolean)
        .join(". ")
        .trim();

      const shortDescFallback =
        longDescriptionRaw.split(". ").slice(0, 3).join(". ") + ".";

      setLocalizationData((prev) => ({
        ...prev,
        // name: data.name || "",
        brand: data.manufacturer || "",
        long_description: longDescriptionRaw,
      }));
      handleNameChange(
        data.name || "",
        data.shortDescription || shortDescFallback
      );
      // Fill specs from details
      if (data.details) {
        const detailsMapped = data.details
          .filter((item) => {
            const nameLower = (item.name || "").toLowerCase();

            // Check excludeKeywords in lowercase
            if (
              excludeKeywords.some((keyword) => nameLower.includes(keyword))
            ) {
              return false;
            }

            // Skip if key is empty or value is empty
            if (!item.name || item.name.trim() === "") return false;
            if (!item.value || item.value.trim() === "") return false;

            return true;
          })
          .map((item) => {
            let cleanValue = item.value || "";
            removePatterns.forEach((pattern) => {
              cleanValue = cleanValue.replace(pattern, "").trim();
            });
            return {
              key: item.name || "",
              value: cleanValue.replace(/\s{2,}/g, " "),
            };
          });

        setSpecifications(detailsMapped);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product: " + error.message);
    } finally {
      setIsFetching(false);
    }
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
        <div className="space-y-2">
          <Label htmlFor="bestBuyApiUrl" className="text-gray-300">
            Best Buy Product API URL
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., https://api.bestbuy.com/v1/products/123456?apiKey=YOUR_KEY"
              className="bg-gray-800 border-gray-700 text-white flex-grow"
              disabled={isFetching}
              value={sku || ""}
              onChange={(e) => setSku(e.target.value)}
            />
            <Button
              onClick={handleFetch}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isFetching}
            >
              {isFetching ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-bounce" />{" "}
                  Fetching...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Fetch
                </>
              )}
            </Button>
          </div>
          {/* {fetchMessage.text && (
            <p
              className={`text-xs ${
                fetchMessage.type === "error"
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {fetchMessage.text}
            </p>
          )} */}
          <p className="text-xs text-gray-500">
            Paste a Best Buy product API URL to auto-fill product details.
          </p>
        </div>

        <Separator className="bg-gray-800" />

        {/* Product Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-gray-300">
            Product Slug (URL)
          </Label>
          <Input
            id="slug"
            placeholder="product-name-in-url"
            value={productData.slug || ""}
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
