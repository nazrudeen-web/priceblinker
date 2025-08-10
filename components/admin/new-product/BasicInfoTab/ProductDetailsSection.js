
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductDetailsSection({
  localizationData,
  setLocalizationData,
  handleNameChange,
}) {
  return (
    <>
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
    </>
  );
}
