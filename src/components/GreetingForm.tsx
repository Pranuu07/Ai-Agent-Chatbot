
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface GreetingData {
  name: string;
  timeOfDay: string;
  mood: string;
  favoriteColor: string;
}

interface GreetingFormProps {
  onSubmit: (data: GreetingData) => void;
}

const GreetingForm = ({ onSubmit }: GreetingFormProps) => {
  const [formData, setFormData] = useState<GreetingData>({
    name: "",
    timeOfDay: "",
    mood: "",
    favoriteColor: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.timeOfDay && formData.mood && formData.favoriteColor) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof GreetingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
        </div>
        <CardTitle className="text-3xl font-bold text-white mb-2">
          Personal Greeting App
        </CardTitle>
        <CardDescription className="text-white/80 text-lg">
          Tell us about yourself to receive a personalized greeting!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">
              What's your name?
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30 transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeOfDay" className="text-white font-medium">
              What time of day is it?
            </Label>
            <Select onValueChange={(value) => handleInputChange("timeOfDay", value)}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood" className="text-white font-medium">
              How are you feeling?
            </Label>
            <Select onValueChange={(value) => handleInputChange("mood", value)}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="excited">Excited</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="motivated">Motivated</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="peaceful">Peaceful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="favoriteColor" className="text-white font-medium">
              What's your favorite color?
            </Label>
            <Select onValueChange={(value) => handleInputChange("favoriteColor", value)}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select your favorite color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105"
            disabled={!formData.name || !formData.timeOfDay || !formData.mood || !formData.favoriteColor}
          >
            Create My Greeting
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GreetingForm;
