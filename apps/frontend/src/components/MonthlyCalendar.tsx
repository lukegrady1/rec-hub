import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Event {
  id: string
  title: string
  starts_at: string
  ends_at?: string
  location?: string
  description?: string
}

interface MonthlyCalendarProps {
  className?: string
  events?: Event[]
}

export default function MonthlyCalendar({ className = '', events = [] }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Generate calendar days
  const calendarDays: (number | null)[] = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push(-(daysInPrevMonth - i))
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push(-(100 + i))
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day > 0 &&
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    )
  }

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    if (day <= 0) return []

    return events.filter(event => {
      const eventDate = new Date(event.starts_at)
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      )
    })
  }

  const hasEvents = (day: number) => {
    return getEventsForDay(day).length > 0
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-bold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs font-semibold text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          const isPrevOrNextMonth = day !== null && day < 0
          const displayDay = day !== null ? (day < 0 ? Math.abs(day) % 100 : day) : ''
          const actualDay = day !== null && day > 0 ? day : 0
          const dayHasEvents = hasEvents(actualDay)

          return (
            <button
              key={idx}
              onClick={() => actualDay > 0 && setSelectedDate(selectedDate === actualDay ? null : actualDay)}
              className={`
                aspect-square flex flex-col items-center justify-center text-sm rounded-lg
                transition-colors relative
                ${isPrevOrNextMonth ? 'text-gray-300' : 'text-gray-700'}
                ${isToday(actualDay) ? 'bg-blue-600 text-white font-bold hover:bg-blue-700' : 'hover:bg-gray-100'}
                ${!isPrevOrNextMonth && !isToday(actualDay) ? 'hover:bg-blue-50' : ''}
                ${selectedDate === actualDay ? 'ring-2 ring-blue-400' : ''}
              `}
              disabled={isPrevOrNextMonth}
            >
              <span>{displayDay}</span>
              {dayHasEvents && !isToday(actualDay) && (
                <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></div>
              )}
              {dayHasEvents && isToday(actualDay) && (
                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Event List for Selected Date */}
      {selectedDate && getEventsForDay(selectedDate).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">
            Events on {monthNames[month]} {selectedDate}:
          </h4>
          <div className="space-y-2">
            {getEventsForDay(selectedDate).map(event => {
              const eventTime = new Date(event.starts_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })
              return (
                <div key={event.id} className="bg-blue-50 p-2 rounded text-xs">
                  <div className="font-semibold text-gray-900">{event.title}</div>
                  <div className="text-gray-600">{eventTime}</div>
                  {event.location && (
                    <div className="text-gray-500 text-xs">📍 {event.location}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
