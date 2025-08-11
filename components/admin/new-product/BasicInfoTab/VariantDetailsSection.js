
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function VariantDetailsSection({
  variantData,
  setVariantData,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-3">Variant Details</h3>
        <p className="text-sm text-gray-400 mb-4">
          Specify the variant-specific attributes like color, storage, and RAM
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="variant-sku" className="text-gray-300">
            SKU *
          </Label>
          <Input
            id="variant-sku"
            placeholder="e.g., 6612779"
            value={variantData.sku}
            onChange={(e) =>
              setVariantData((prev) => ({ ...prev, sku: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variant-color" className="text-gray-300">
            Color
          </Label>
          <Input
            id="variant-color"
            placeholder="e.g., Titanium Black"
            value={variantData.color}
            onChange={(e) =>
              setVariantData((prev) => ({ ...prev, color: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variant-storage" className="text-gray-300">
            Storage
          </Label>
          <Input
            id="variant-storage"
            placeholder="e.g., 256GB"
            value={variantData.storage}
            onChange={(e) =>
              setVariantData((prev) => ({ ...prev, storage: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variant-ram" className="text-gray-300">
            RAM
          </Label>
          <Input
            id="variant-ram"
            placeholder="e.g., 12GB"
            value={variantData.ram}
            onChange={(e) =>
              setVariantData((prev) => ({ ...prev, ram: e.target.value }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>
    </div>
  );
}
