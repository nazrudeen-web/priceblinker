
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductDetailsSection({
  productData,
  setProductData,
  localizationData,
  setLocalizationData,
  handleNameChange,
}) {
  const categories = [
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
    { value: "tablets", label: "Tablets" },
    { value: "headphones", label: "Headphones" },
    { value: "smartwatches", label: "Smartwatches" },
    { value: "cameras", label: "Cameras" },
    { value: "gaming", label: "Gaming" },
    { value: "electronics", label: "Electronics" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-3">Product Details</h3>
        <p className="text-sm text-gray-400 mb-4">
          Basic product information that applies to all variants
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-name" className="text-gray-300">
            Product Name *
          </Label>
          <Input
            id="product-name"
            placeholder="e.g., Samsung Galaxy S25 Ultra - 256GB Titanium Black"
            value={localizationData.name}
            onChange={(e) => handleNameChange(e.target.value, localizationData.short_description)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-brand" className="text-gray-300">
            Brand
          </Label>
          <Input
            id="product-brand"
            placeholder="e.g., Samsung"
            value={localizationData.brand}
            onChange={(e) =>
              setLocalizationData((prev) => ({ ...prev, brand: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-category" className="text-gray-300">
          Category *
        </Label>
        <Select
          value={productData.category}
          onValueChange={(value) =>
            setProductData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {categories.map((category) => (
              <SelectItem
                key={category.value}
                value={category.value}
                className="text-white hover:bg-gray-700"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
