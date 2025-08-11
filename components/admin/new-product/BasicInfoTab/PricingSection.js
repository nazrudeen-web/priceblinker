import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

export default function PricingSection({ 
  prices, 
  setPrices 
}) {
  const [newPrice, setNewPrice] = useState({
    store_name: "",
    country: "PH",
    price: "",
    currency: "PHP",
    affiliate_link: "",
  });

  const handleAddPrice = () => {
    if (newPrice.store_name && newPrice.price) {
      setPrices((prev) => [...prev, { ...newPrice }]);
      setNewPrice({
        store_name: "",
        country: "PH",
        price: "",
        currency: "PHP",
        affiliate_link: "",
      });
    }
  };

  const handleRemovePrice = (index) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const stores = [
    "Best Buy",
    "Lazada",
    "Shopee", 
    "Amazon",
    "Argomall",
    "Digital Walker",
    "Power Mac Center",
    "iStudio",
    "Kimstore"
  ];

  const currencies = [
    { code: "PHP", symbol: "₱" },
    { code: "USD", symbol: "$" }
  ];

  return (
    <div className="space-y-4">
      {/* Add New Price Form - Compact */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-gray-300 text-sm">Store Name</Label>
            <Select 
              value={newPrice.store_name} 
              onValueChange={(value) => setNewPrice(prev => ({ ...prev, store_name: value }))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-9">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {stores.map(store => (
                  <SelectItem key={store} value={store} className="text-white hover:bg-gray-800">
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-300 text-sm">Price</Label>
            <div className="flex">
              <Select 
                value={newPrice.currency} 
                onValueChange={(value) => setNewPrice(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-9 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {currencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code} className="text-white hover:bg-gray-800">
                      {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={newPrice.price}
                onChange={(e) => setNewPrice(prev => ({ ...prev, price: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white h-9 ml-2 flex-1"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-300 text-sm">Affiliate Link (Optional)</Label>
          <Input
            type="url"
            placeholder="https://store.com/product-link"
            value={newPrice.affiliate_link}
            onChange={(e) => setNewPrice(prev => ({ ...prev, affiliate_link: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white h-9"
          />
        </div>

        <Button
          onClick={handleAddPrice}
          disabled={!newPrice.store_name || !newPrice.price}
          size="sm"
          className="bg-white text-black hover:bg-gray-200 w-fit"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Price
        </Button>
      </div>

      {/* Existing Prices - Compact */}
      {prices.length > 0 && (
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Added Prices</Label>
          <div className="space-y-2">
            {prices.map((price, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-800 rounded-md"
              >
                <div className="text-sm">
                  <span className="text-white font-medium">{price.store_name}</span>
                  <span className="text-gray-400 ml-2">
                    {price.currency} {price.price}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePrice(index)}
                  className="text-red-400 hover:bg-red-900/20 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}