import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductService } from "@/services/productService";
import { Download } from "lucide-react";

export default function AddVariantModal({ isOpen, onClose, onAddVariant }) {
  const [variantSku, setVariantSku] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchVariant = async () => {
    if (!variantSku.trim()) return;
    
    setIsFetching(true);
    try {
      await onAddVariant(variantSku);
      setVariantSku("");
    } catch (error) {
      console.error("Error adding variant:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Variant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="variant-sku" className="text-gray-300">
              Variant SKU
            </Label>
            <div className="flex gap-2">
              <Input
                id="variant-sku"
                placeholder="Enter SKU (e.g., 6612780)"
                value={variantSku}
                onChange={(e) => setVariantSku(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white flex-1"
                disabled={isFetching}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchVariant()}
              />
              <Button
                onClick={handleFetchVariant}
                disabled={isFetching || !variantSku.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                {isFetching ? "Fetching..." : "Add"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Enter a Best Buy SKU to fetch variant-specific data (name, storage, RAM, color, images)
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}