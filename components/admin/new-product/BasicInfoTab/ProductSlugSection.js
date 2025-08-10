
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProductSlugSection({ productData, setProductData }) {
  return (
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
  );
}
