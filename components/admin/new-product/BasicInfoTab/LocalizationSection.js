
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availableCountries = [{ code: "PH", name: "Philippines" }];

export default function LocalizationSection({
  localizationData,
  setLocalizationData,
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country" className="text-gray-300">
          Country *
        </Label>
        <Select
          value={localizationData.country}
          onValueChange={(value) =>
            setLocalizationData((prev) => ({ ...prev, country: value }))
          }
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {availableCountries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="language" className="text-gray-300">
          Language *
        </Label>
        <Select
          value={localizationData.language}
          onValueChange={(value) =>
            setLocalizationData((prev) => ({ ...prev, language: value }))
          }
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
