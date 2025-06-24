
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PersonalizedMessage from "@/components/PersonalizedMessage";
import { RefreshCw, Sparkles } from "lucide-react";

interface GreetingData {
  name: string;
  timeOfDay: string;
  mood: string;
  favoriteColor: string;
}

interface GreetingDisplayProps {
  data: GreetingData;
  onReset: () => void;
}

const GreetingDisplay = ({ data, onReset }: GreetingDisplayProps) => {
  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Personal Greeting
          </h1>
        </div>

        <PersonalizedMessage data={data} />

        <div className="flex justify-center mt-8">
          <Button
            onClick={onReset}
            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-6 py-3 transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Create Another Greeting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GreetingDisplay;
