
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProductSlugSection({
  productData,
  setProductData,
  variantData,
  setVariantData,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="product-slug" className="text-gray-300">
          Product Slug
        </Label>
        <Input
          id="product-slug"
          placeholder="e.g., samsung-galaxy-s25"
          value={productData.slug}
          onChange={(e) =>
            setProductData((prev) => ({ ...prev, slug: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
        <p className="text-xs text-gray-500">
          Base product URL slug (shared across variants)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="variant-slug" className="text-gray-300">
          Variant Slug
        </Label>
        <Input
          id="variant-slug"
          placeholder="e.g., samsung-galaxy-s25-256gb-black"
          value={variantData.slug}
          onChange={(e) =>
            setVariantData((prev) => ({ ...prev, slug: e.target.value }))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
        <p className="text-xs text-gray-500">
          Specific variant URL slug (unique per variant)
        </p>
      </div>
    </div>
  );
}
