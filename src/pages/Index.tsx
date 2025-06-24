
import { useState } from "react";
import GreetingForm from "@/components/GreetingForm";
import GreetingDisplay from "@/components/GreetingDisplay";

interface GreetingData {
  name: string;
  timeOfDay: string;
  mood: string;
  favoriteColor: string;
}

const Index = () => {
  const [greetingData, setGreetingData] = useState<GreetingData | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleGreetingSubmit = (data: GreetingData) => {
    setGreetingData(data);
    setShowForm(false);
  };

  const handleReset = () => {
    setGreetingData(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {showForm ? (
          <GreetingForm onSubmit={handleGreetingSubmit} />
        ) : (
          <GreetingDisplay data={greetingData!} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
