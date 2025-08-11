
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
    affiliate_link: ""
  });

  const handleAddPrice = () => {
    if (newPrice.store_name && newPrice.price) {
      setPrices(prev => [...prev, {
        ...newPrice,
        price: parseFloat(newPrice.price),
        valid_from: new Date().toISOString(),
        valid_to: null
      }]);
      setNewPrice({
        store_name: "",
        country: "PH", 
        price: "",
        currency: "PHP",
        affiliate_link: ""
      });
    }
  };

  const handleRemovePrice = (index) => {
    setPrices(prev => prev.filter((_, i) => i !== index));
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
      <div>
        <h3 className="text-lg font-medium text-white mb-3">Pricing Information</h3>
        <p className="text-sm text-gray-400 mb-4">
          Add current prices from different stores for this product variant
        </p>
      </div>

      {/* Existing Prices */}
      {prices.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Current Prices</h4>
          {prices.map((price, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Store</p>
                      <p className="text-white">{price.store_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-white">{price.currency} {price.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Country</p>
                      <p className="text-white">{price.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Link</p>
                      <p className="text-white text-xs truncate">{price.affiliate_link || "N/A"}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemovePrice(index)}
                    className="ml-4 bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Price */}
      <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300">Add New Price</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store-name" className="text-gray-300">Store *</Label>
            <Select 
              value={newPrice.store_name} 
              onValueChange={(value) => setNewPrice(prev => ({ ...prev, store_name: value }))}
            >
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-600">
                {stores.map(store => (
                  <SelectItem key={store} value={store} className="text-white hover:bg-gray-800">
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-gray-300">Price *</Label>
            <div className="flex">
              <Select 
                value={newPrice.currency} 
                onValueChange={(value) => setNewPrice(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
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
                className="bg-gray-900 border-gray-600 text-white ml-2 flex-1"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-300">Country</Label>
            <Select 
              value={newPrice.country} 
              onValueChange={(value) => setNewPrice(prev => ({ ...prev, country: value }))}
            >
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-600">
                <SelectItem value="PH" className="text-white hover:bg-gray-800">Philippines</SelectItem>
                <SelectItem value="US" className="text-white hover:bg-gray-800">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliate-link" className="text-gray-300">Affiliate Link</Label>
          <Input
            placeholder="https://store.com/product-link"
            value={newPrice.affiliate_link}
            onChange={(e) => setNewPrice(prev => ({ ...prev, affiliate_link: e.target.value }))}
            className="bg-gray-900 border-gray-600 text-white"
          />
        </div>

        <Button
          onClick={handleAddPrice}
          disabled={!newPrice.store_name || !newPrice.price}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Price
        </Button>
      </div>
    </div>
  );
}
