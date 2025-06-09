import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, ChevronUp, ChevronDown } from "lucide-react"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

const MONTHS = [
  "Январь",
  "Февраль", 
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

export default function CustomCalendar({ onDateRangeChange }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [isOpen, setIsOpen] = useState(false)
  const [selectionStep, setSelectionStep] = useState("start")

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [tempTime, setTempTime] = useState({ hour: 12, minute: 0 })

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to be last (6)
  }

  const isPastDay = (year, month, day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkDate = new Date(year, month, day)
    checkDate.setHours(0, 0, 0, 0)

    return checkDate < today
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Previous month days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear)

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        isPast: isPastDay(prevYear, prevMonth, daysInPrevMonth - i),
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isPast: isPastDay(currentYear, currentMonth, day),
      })
    }

    // Next month days
    const totalCells = Math.ceil(days.length / 7) * 7
    const remainingCells = totalCells - days.length
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        isPast: isPastDay(nextYear, nextMonth, day),
      })
    }

    return days
  }

  const handleDateSelect = (day) => {
    const selectedDateTime = {
      year: currentYear,
      month: currentMonth,
      day,
      hour: tempTime.hour,
      minute: tempTime.minute,
    }

    if (selectionStep === "start") {
      setStartDate(selectedDateTime)
      setSelectionStep("end")
    } else {
      setEndDate(selectedDateTime)
      setSelectionStep("start")

      // Convert to Unix timestamp and log
      const startTimestamp = dateTimeToUnixTimestamp(startDate)
      const endTimestamp = dateTimeToUnixTimestamp(selectedDateTime)

      console.log("start:", startTimestamp)
      console.log("end:", endTimestamp)

      // Передаем данные в родительский компонент
      if (onDateRangeChange) {
        onDateRangeChange(startTimestamp, endTimestamp)
      }

      setIsOpen(false)
    }
  }

  const dateTimeToUnixTimestamp = (dateTime) => {
    const date = new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour, dateTime.minute)
    return Math.floor(date.getTime() / 1000)
  }

  const isDateSelected = (day) => {
    if (startDate && startDate.year === currentYear && startDate.month === currentMonth && startDate.day === day) {
      return "start"
    }
    if (endDate && endDate.year === currentYear && endDate.month === currentMonth && endDate.day === day) {
      return "end"
    }
    return false
  }

  const adjustTime = (type, direction) => {
    setTempTime((prev) => {
      if (type === "hour") {
        const newHour = direction === "up" ? (prev.hour + 1) % 24 : prev.hour === 0 ? 23 : prev.hour - 1
        return { ...prev, hour: newHour }
      } else {
        const newMinute = direction === "up" ? (prev.minute + 1) % 60 : prev.minute === 0 ? 59 : prev.minute - 1
        return { ...prev, minute: newMinute }
      }
    })
  }

  const navigateMonth = (direction) => {
    const today = new Date()
    const currentMonthNow = today.getMonth()
    const currentYearNow = today.getFullYear()

    if (direction === "prev") {
      // Проверяем, не пытаемся ли мы перейти к прошлому месяцу от текущего
      if (currentYear < currentYearNow || (currentYear === currentYearNow && currentMonth <= currentMonthNow)) {
        return // Не позволяем перейти к прошлому месяцу
      }

      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear((prev) => prev - 1)
      } else {
        setCurrentMonth((prev) => prev - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear((prev) => prev + 1)
      } else {
        setCurrentMonth((prev) => prev + 1)
      }
    }
  }

  const resetSelection = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectionStep("start")
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Button
        variant="outline"
        className="w-full justify-between h-12 px-4 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-600">
          {startDate && endDate
            ? `${startDate.day}.${startDate.month + 1}.${startDate.year} - ${endDate.day}.${endDate.month + 1}.${endDate.year}`
            : startDate
              ? `От: ${startDate.day}.${startDate.month + 1}.${startDate.year} (выберите конечную дату)`
              : "Выбрать закрытые даты"}
        </span>
        <Calendar className="h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="mt-2 p-0 shadow-lg">
          <CardContent className="p-4">
            {/* Time Selector */}
            <div className="flex justify-center items-center mb-4 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="sm" onClick={() => adjustTime("hour", "up")} className="h-6 w-6 p-0">
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-mono w-8 text-center">{tempTime.hour.toString().padStart(2, "0")}</span>
                  <Button variant="ghost" size="sm" onClick={() => adjustTime("hour", "down")} className="h-6 w-6 p-0">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <span className="text-lg">:</span>

                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="sm" onClick={() => adjustTime("minute", "up")} className="h-6 w-6 p-0">
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-mono w-8 text-center">
                    {tempTime.minute.toString().padStart(2, "0")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => adjustTime("minute", "down")}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h3 className="text-lg font-medium">
                {MONTHS[currentMonth]} {currentYear}
              </h3>

              <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Selection Status */}
            <div className="text-center mb-3 text-sm text-gray-600">
              {selectionStep === "start" ? "Выберите начальную дату" : "Выберите конечную дату"}
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((dayObj, index) => {
                const isSelected = dayObj.isCurrentMonth && isDateSelected(dayObj.day)
                const isClickable = dayObj.isCurrentMonth && !dayObj.isPast

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`
                      h-10 w-10 p-0 text-sm
                      ${!dayObj.isCurrentMonth ? "text-gray-300" : dayObj.isPast ? "text-gray-300 line-through" : "text-gray-900"}
                      ${isSelected === "start" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                      ${isSelected === "end" ? "bg-green-500 text-white hover:bg-green-600" : ""}
                      ${isClickable ? "hover:bg-gray-100" : "cursor-not-allowed opacity-50"}
                    `}
                    onClick={() => isClickable && handleDateSelect(dayObj.day)}
                    disabled={!isClickable}
                  >
                    {dayObj.day}
                  </Button>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={resetSelection}>
                Сбросить
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Закрыть
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      {(startDate || endDate) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="font-medium mb-2">Выбранные даты:</div>
          {startDate && (
            <div>
              Начало: {startDate.day}.{startDate.month + 1}.{startDate.year} {startDate.hour}:
              {startDate.minute.toString().padStart(2, "0")}
            </div>
          )}
          {endDate && (
            <div>
              Конец: {endDate.day}.{endDate.month + 1}.{endDate.year} {endDate.hour}:
              {endDate.minute.toString().padStart(2, "0")}
            </div>
          )}
          {startDate && endDate && (
            <div className="mt-2 text-xs text-gray-600">
              <div>Start timestamp: {dateTimeToUnixTimestamp(startDate)}</div>
              <div>End timestamp: {dateTimeToUnixTimestamp(endDate)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
