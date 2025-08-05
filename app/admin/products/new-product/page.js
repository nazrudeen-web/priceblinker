// NewProductPage.jsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Eye,
  ArrowLeft,
  Globe,
  FileText,
  Settings,
  Image,
} from "lucide-react";
import Link from "next/link";
import BasicInfoTab from "@/components/admin/new-product/BasicInfoTab";
import SEOTab from "@/components/admin/new-product/SEOTab";
import ImagesTab from "@/components/admin/new-product/ImagesTab";
import AvailabilityTab from "@/components/admin/new-product/AvailabilityTab";
import { supabase } from "@/lib/supabase";

export default function NewProductPage() {
  const [productData, setProductData] = useState({ slug: "", status: "draft" });
  const [localizationData, setLocalizationData] = useState({
    country: "CA",
    language: "en",
    name: "",
    brand: "",
    short_description: "",
    long_description: "",
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    category: "",
  });
  const [specifications, setSpecifications] = useState([]);
  const [images, setImages] = useState([]);
  const [availability, setAvailability] = useState([{ country: "CA" }]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name) => {
    setLocalizationData((prev) => ({ ...prev, name }));
    if (!productData.slug) {
      setProductData((prev) => ({ ...prev, slug: generateSlug(name) }));
    }
    if (!localizationData.meta_title) {
      setLocalizationData((prev) => ({
        ...prev,
        meta_title: `${name} - Best Prices in Canada`,
      }));
    }
  };

  const handleCountryToggle = (countryCode) => {
    setAvailability((prev) => {
      const exists = prev.some((item) => item.country === countryCode);
      if (exists) {
        return prev.filter((item) => item.country !== countryCode);
      } else {
        return [...prev, { country: countryCode }];
      }
    });
  };

  const handleSave = async (status) => {
    try {
      // 1. Insert into the main 'products' table first
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          slug: productData.slug,
          status: status,
          category: localizationData.category,
        })
        .select("id")
        .single();

      if (productError) throw productError;

      const product_id = newProduct.id;

      // 2. Prepare and insert into the 'product_localizations' table
      const localizationToInsert = {
        product_id,
        country: localizationData.country,
        language: localizationData.language,
        name: localizationData.name,
        brand: localizationData.brand,
        short_description: localizationData.short_description,
        long_description: localizationData.long_description,
        meta_title: localizationData.meta_title,
        meta_description: localizationData.meta_description,
        canonical_url: localizationData.canonical_url,
      };
      const { error: localizationError } = await supabase
        .from("product_localizations")
        .insert(localizationToInsert);
      if (localizationError) throw localizationError;

      // 3. Prepare data for the remaining tables
      const specificationsToInsert = specifications.map((spec) => ({
        product_id,
        ...spec,
      }));
      const imagesToInsert = images.map((img) => ({ product_id, ...img }));
      const availabilityToInsert = availability.map((av) => ({
        product_id,
        ...av,
      }));

      // 4. Run all inserts concurrently and check for errors
      const [
        { error: specError },
        { error: imageError },
        { error: availabilityError },
      ] = await Promise.all([
        supabase.from("product_specifications").insert(specificationsToInsert),
        supabase.from("product_images").insert(imagesToInsert),
        supabase.from("product_availability").insert(availabilityToInsert),
      ]);

      if (specError || imageError || availabilityError) {
        throw new Error("Failed to insert related product data.");
      }

      console.log("Product and all related data saved successfully!", {
        product_id,
      });
      // Handle success, e.g., redirect or show a toast message
    } catch (error) {
      console.error("Error saving product:", error.message);
      // Handle error gracefully, maybe display an error message to the user
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Add New Product
            </h1>
            <p className="text-gray-400">
              Create a new product for price comparison
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSave("draft")}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-200 cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSave("published")}
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Tabs for Product Information */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Image className="mr-2 h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="data-[state=active]:bg-gray-700 cursor-pointer"
          >
            <Globe className="mr-2 h-4 w-4" />
            Availability
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="basic" className="space-y-4">
          <BasicInfoTab
            productData={productData}
            setProductData={setProductData}
            localizationData={localizationData}
            setLocalizationData={setLocalizationData}
            specifications={specifications}
            setSpecifications={setSpecifications}
            handleNameChange={handleNameChange}
          />
        </TabsContent>
        <TabsContent value="seo" className="space-y-4">
          <SEOTab
            localizationData={localizationData}
            setLocalizationData={setLocalizationData}
          />
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <ImagesTab images={images} setImages={setImages} />
        </TabsContent>
        <TabsContent value="availability" className="space-y-4">
          <AvailabilityTab
            availability={availability}
            handleCountryToggle={handleCountryToggle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
