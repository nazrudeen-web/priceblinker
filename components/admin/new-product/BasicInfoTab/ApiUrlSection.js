
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Data cleaning utilities
const removePatterns = [
  /\(unlocked\)/gi,
  /\bunlocked\b/gi,
  /\bunited states\b/gi,
];

const excludeKeywords = [
  "model number",
  "carrier",
  "carrier compatibility",
  "unlocked",
];

const cleanData = (obj) => {
  if (typeof obj === "string") {
    let cleaned = obj;
    removePatterns.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, "").trim();
    });
    return cleaned.replace(/\s{2,}/g, " ");
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

export default function ApiUrlSection({
  sku,
  setSku,
  isFetching,
  setIsFetching,
  setFetchedData,
  setLocalizationData,
  handleNameChange,
  setSpecifications,
}) {
  const handleFetch = async () => {
    if (!sku) {
      alert("Please enter SKU");
      return;
    }

    console.log("Fetching SKU:", sku);
    setIsFetching(true);
    setFetchedData(null);

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

            if (
              excludeKeywords.some((keyword) => nameLower.includes(keyword))
            ) {
              return false;
            }

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
              <Download className="mr-2 h-4 w-4 animate-bounce" />
              Fetching...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Fetch
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Paste a Best Buy product API URL to auto-fill product details.
      </p>
    </div>
  );
}
