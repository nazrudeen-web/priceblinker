
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ApiUrlSection({
  sku,
  setSku,
  isFetching,
  handleFetch,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="bestbuy-url" className="text-gray-300">
        Best Buy API (SKU)
      </Label>
      <div className="flex gap-2">
        <Input
          id="bestbuy-url"
          placeholder="Enter Best Buy SKU (e.g., 6418599)"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white flex-1"
          disabled={isFetching}
        />
        <Button
          onClick={handleFetch}
          disabled={isFetching}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          {isFetching ? "Fetching..." : "Fetch"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Enter a Best Buy SKU to automatically fetch product details, images, and
        specifications.
      </p>
    </div>
  );
}
