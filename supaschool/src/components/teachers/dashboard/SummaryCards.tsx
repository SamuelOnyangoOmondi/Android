
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Book, Clock, UserCheck, ChevronUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  iconName: string;
  trend: string;
  trendUp: boolean | null;
  color: string;
  bgColor: string;
}

interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ cards }) => {
  // Function to render the appropriate icon based on iconName
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return <Users className="h-5 w-5" />;
      case "Book":
        return <Book className="h-5 w-5" />;
      case "Clock":
        return <Clock className="h-5 w-5" />;
      case "UserCheck":
        return <UserCheck className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`stats-card ${card.color} shadow-md hover:shadow-lg transition-all duration-300 p-5`}>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
              <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor} self-start`}>
              {renderIcon(card.iconName)}
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            {card.trendUp !== null && (
              <>
                <span className={`flex items-center ${card.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {card.trendUp ? <ChevronUp className="h-3 w-3" /> : <ChevronUp className="h-3 w-3 rotate-180" />}
                </span>
                <span className={`ml-1 ${card.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>{card.trend}</span>
              </>
            )}
            {card.trendUp === null && <span className="text-gray-500">{card.trend}</span>}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
