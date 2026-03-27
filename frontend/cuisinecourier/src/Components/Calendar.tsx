import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  events?: { date: string; title: string; type: string }[];
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events = [], onDateSelect }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    // Fixed: Rwf{ -> ${
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const renderDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      // Fixed: Rwf{ -> ${
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();
      
      days.push(
        <div 
          key={day}
          // Fixed: Rwf{ -> ${
          className={`p-2 min-h-20 border border-gray-100 cursor-pointer transition-colors ${
            isToday ? 'bg-yellow-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onDateSelect?.(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          {/* Fixed: Rwf{ -> ${ */}
          <span className={`text-sm font-bold ${isToday ? 'text-yellow-600' : 'text-gray-700'}`}>
            {day}
          </span>
          {dayEvents.map((event, i) => (
            <div 
              key={i}
              // Fixed: Rwf{ -> ${
              className={`text-xs mt-1 px-1 py-0.5 rounded truncate ${
                event.type === 'wedding' ? 'bg-purple-100 text-purple-700' :
                event.type === 'corporate' ? 'bg-blue-100 text-blue-700' :
                event.type === 'birthday' ? 'bg-pink-100 text-pink-700' :
                'bg-gray-100 text-gray-700'
              }`}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-brand-black text-white p-4 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-bold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;