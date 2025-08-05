// components/product/SEOTab.jsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SEOTab({ localizationData, setLocalizationData }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">SEO Information</CardTitle>
        <CardDescription className="text-gray-400">
          SEO data for this localization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="metaTitle" className="text-gray-300">
            Meta Title
          </Label>
          <Input
            id="metaTitle"
            placeholder="Product Title for SEO"
            value={localizationData.meta_title}
            onChange={(e) =>
              setLocalizationData((prev) => ({
                ...prev,
                meta_title: e.target.value,
              }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500">
            Appears as the title in Google search results.
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="metaDescription" className="text-gray-300">
            Meta Description
          </Label>
          <Textarea
            id="metaDescription"
            placeholder="Short summary for search engines..."
            value={localizationData.meta_description}
            onChange={(e) =>
              setLocalizationData((prev) => ({
                ...prev,
                meta_description: e.target.value,
              }))
            }
            className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
          />
          <p className="text-xs text-gray-500">
            This text will appear in the search snippet.
          </p>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonicalUrl" className="text-gray-300">
            Canonical URL (optional)
          </Label>
          <Input
            id="canonicalUrl"
            placeholder="https://example.com/product-original"
            value={localizationData.canonical_url}
            onChange={(e) =>
              setLocalizationData((prev) => ({
                ...prev,
                canonical_url: e.target.value,
              }))
            }
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500">
            If this product exists on another site, add its original URL.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
