
import { useState, useEffect } from "react";

interface GreetingData {
  name: string;
  timeOfDay: string;
  mood: string;
  favoriteColor: string;
}

interface PersonalizedMessageProps {
  data: GreetingData;
}

const PersonalizedMessage = ({ data }: PersonalizedMessageProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = (timeOfDay: string) => {
    const greetings = {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
      night: "Good night"
    };
    return greetings[timeOfDay as keyof typeof greetings] || "Hello";
  };

  const getMoodMessage = (mood: string) => {
    const messages = {
      happy: "Your happiness is contagious! Keep spreading those positive vibes! 😊",
      excited: "Your excitement is amazing! Channel that energy into something wonderful! ⚡",
      calm: "Your calmness is a superpower. Enjoy this peaceful moment! 🧘‍♀️",
      motivated: "Your motivation will take you places! Go chase those dreams! 🚀",
      creative: "Your creativity knows no bounds! Let your imagination run wild! 🎨",
      peaceful: "Your peaceful energy is beautiful. Take time to appreciate this moment! ☮️"
    };
    return messages[mood as keyof typeof messages] || "You're amazing just as you are!";
  };

  const getColorEmoji = (color: string) => {
    const emojis = {
      blue: "💙",
      green: "💚",
      purple: "💜",
      pink: "💗",
      orange: "🧡",
      red: "❤️",
      yellow: "💛"
    };
    return emojis[color as keyof typeof emojis] || "💫";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-4">
          {getTimeGreeting(data.timeOfDay)}, {data.name}! 
          {getColorEmoji(data.favoriteColor)}
        </h2>
        
        <p className="text-xl text-white/90 leading-relaxed mb-4">
          {getMoodMessage(data.mood)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Current Time</h3>
            <p className="text-2xl font-mono text-white/90">{formatTime(currentTime)}</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Your Vibe</h3>
            <p className="text-lg text-white/90 capitalize">{data.mood} & {data.favoriteColor} lover</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
          <p className="text-lg text-white/90 italic">
            "Every moment is a fresh beginning. Make this {data.timeOfDay} count, {data.name}!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedMessage;
