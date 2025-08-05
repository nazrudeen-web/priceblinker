// components/product/ImagesTab.jsx

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function ImagesTab({ images, setImages }) {
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (imageUrl) {
      setImages((prev) => [
        ...prev,
        {
          image_url: imageUrl,
          is_main: prev.length === 0,
        },
      ]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_main: i === index,
      }))
    );
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Product Images</CardTitle>
        <CardDescription className="text-gray-400">
          Upload and manage product images (stored in product_images table).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mt-6">
          <Label className="text-gray-300 block mb-2">Add Image by URL</Label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
            />
            <Button
              className="bg-white text-black hover:bg-gray-200"
              onClick={handleAddImage}
            >
              Add
            </Button>
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded border border-gray-700"
                />
                {image.is_main && (
                  <Badge className="absolute top-2 left-2 bg-green-600">
                    Main
                  </Badge>
                )}
                {!image.is_main && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetMainImage(index)}
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                  >
                    Set Main
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
