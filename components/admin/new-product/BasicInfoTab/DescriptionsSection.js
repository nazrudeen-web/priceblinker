
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DescriptionsSection({
  localizationData,
  setLocalizationData,
}) {
  return (
    <>
      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription" className="text-gray-300">
          Short Description
        </Label>
        <Textarea
          id="shortDescription"
          placeholder="Brief description for product listings"
          value={localizationData.short_description}
          onChange={(e) =>
            setLocalizationData((prev) => ({
              ...prev,
              short_description: e.target.value,
            }))
          }
          className="bg-gray-800 border-gray-700 text-white"
          rows={3}
        />
      </div>

      {/* Long Description */}
      <div className="space-y-2">
        <Label htmlFor="longDescription" className="text-gray-300">
          Long Description (Markdown)
        </Label>
        <Textarea
          id="longDescription"
          placeholder="Detailed product description with markdown support..."
          value={localizationData.long_description}
          onChange={(e) =>
            setLocalizationData((prev) => ({
              ...prev,
              long_description: e.target.value,
            }))
          }
          className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
          rows={3}
        />
        <p className="text-xs text-gray-500">
          You can use markdown formatting for rich text.
        </p>
      </div>
    </>
  );
}
