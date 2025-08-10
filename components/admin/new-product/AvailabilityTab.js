import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function AvailabilityTab({ availability, handleCountryToggle }) {
  const availableCountries = [{ code: "PH", name: "Philippines" }];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Country Availability</CardTitle>
        <CardDescription className="text-gray-400">
          Select which countries this product is available in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {availableCountries.map((country) => (
            <div
              key={country.code}
              className="flex items-center justify-between p-4 bg-gray-800 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://flagcdn.com/w40/${
                    country.code === "UK" ? "gb" : country.code.toLowerCase()
                  }.png`}
                  alt={`${country.code} flag`}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="text-white">{country.name}</span>
              </div>
              <Switch
                // Now, the switch is checked ONLY if the country is in the 'availability' array
                checked={availability.some(
                  (item) => item.country === country.code
                )}
                onCheckedChange={() => handleCountryToggle(country.code)}
              />
            </div>
          ))}
        </div>

        {availability.length > 0 && (
          <div className="mt-4">
            <Label className="text-gray-300">Available in Countries:</Label>
            <div className="flex gap-2 mt-2">
              {availability.map((item) => (
                <Badge key={item.country} className="bg-blue-900 text-blue-300">
                  {availableCountries.find((c) => c.code === item.country)
                    ?.name || item.country}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
