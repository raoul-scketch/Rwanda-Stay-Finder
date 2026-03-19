import { useState, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onDone?: () => void;
}

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function MonthGrid({
  month,
  from,
  to,
  hovered,
  onDayClick,
  onDayHover,
  onDayLeave,
}: {
  month: Date;
  from?: Date;
  to?: Date;
  hovered: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date) => void;
  onDayLeave: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const rangeEnd = to || hovered;

  return (
    <div className="w-full min-w-[250px]">
      <div className="text-center font-semibold text-foreground mb-4 text-sm">
        {format(month, "MMMM yyyy")}
      </div>
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-muted-foreground py-1.5 font-medium"
          >
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          const isPast = isBefore(day, today);
          const sameMonth = isSameMonth(day, month);
          const isFrom = from && isSameDay(day, from);
          const isTo = to && isSameDay(day, to);
          const isHoverEnd = !to && hovered && from && isSameDay(day, hovered);

          let inRange = false;
          if (from && rangeEnd) {
            const rangeStart = from;
            const rangeEndDate = rangeEnd;
            if (!isBefore(rangeEndDate, rangeStart)) {
              inRange = isAfter(day, rangeStart) && isBefore(day, rangeEndDate);
            } else {
              inRange = isAfter(day, rangeEndDate) && isBefore(day, rangeStart);
            }
          }

          const isSelected = isFrom || isTo || isHoverEnd;
          const isRangeStart = isFrom;
          const isRangeEnd = isTo || isHoverEnd;

          return (
            <div
              key={i}
              className={`relative h-9 flex items-center justify-center
                ${!sameMonth ? "invisible pointer-events-none" : ""}
                ${inRange ? "bg-primary/15" : ""}
                ${inRange && !isRangeStart ? "" : ""}
                ${isRangeStart && inRange ? "rounded-l-full" : ""}
                ${isRangeEnd && inRange ? "rounded-r-full" : ""}
              `}
              onClick={() => {
                if (!isPast && sameMonth) onDayClick(day);
              }}
              onMouseEnter={() => {
                if (!isPast && sameMonth) onDayHover(day);
              }}
              onMouseLeave={onDayLeave}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors select-none
                  ${isPast ? "text-muted-foreground/30 cursor-not-allowed" : "cursor-pointer"}
                  ${isSelected ? "bg-primary text-white font-bold shadow-md" : ""}
                  ${!isSelected && !isPast && sameMonth ? "hover:bg-secondary hover:text-foreground" : ""}
                  ${isToday(day) && !isSelected ? "border border-primary text-primary font-semibold" : ""}
                  ${inRange && !isSelected ? "text-foreground" : ""}
                `}
              >
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({ value, onChange, onDone }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const m = new Date();
    m.setDate(1);
    return m;
  });
  const [hovered, setHovered] = useState<Date | null>(null);
  const [step, setStep] = useState<"from" | "to">(value.from ? "to" : "from");

  const nextMonth = addMonths(currentMonth, 1);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (step === "from") {
        onChange({ from: day, to: undefined });
        setStep("to");
      } else {
        if (value.from && isBefore(day, value.from)) {
          onChange({ from: day, to: undefined });
          setStep("to");
        } else {
          onChange({ from: value.from, to: day });
          setStep("from");
        }
      }
    },
    [step, value.from, onChange]
  );

  const handleClear = () => {
    onChange({ from: undefined, to: undefined });
    setStep("from");
    setHovered(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-6 mb-5 px-1">
        <div className="flex-1 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Check-in</div>
          <div className={`text-sm font-semibold ${value.from ? "text-primary" : "text-muted-foreground"}`}>
            {value.from ? format(value.from, "EEE, MMM d") : "Select date"}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex-1 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Check-out</div>
          <div className={`text-sm font-semibold ${value.to ? "text-primary" : "text-muted-foreground"}`}>
            {value.to ? format(value.to, "EEE, MMM d") : "Select date"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-8 h-8 rounded-full border border-border hover:bg-secondary flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-8 flex-1 justify-center">
          <span />
          <span />
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-8 h-8 rounded-full border border-border hover:bg-secondary flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-6">
        <MonthGrid
          month={currentMonth}
          from={value.from}
          to={value.to}
          hovered={hovered}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          onDayLeave={() => setHovered(null)}
        />
        <div className="w-px bg-border shrink-0" />
        <MonthGrid
          month={nextMonth}
          from={value.from}
          to={value.to}
          hovered={hovered}
          onDayClick={handleDayClick}
          onDayHover={setHovered}
          onDayLeave={() => setHovered(null)}
        />
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <button
          onClick={handleClear}
          className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Clear dates
        </button>
        {value.from && value.to ? (
          <Button size="sm" onClick={onDone}>
            Done · {Math.round((value.to.getTime() - value.from.getTime()) / 86400000)} nights
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            {step === "from" ? "Select check-in date" : "Select check-out date"}
          </span>
        )}
      </div>
    </div>
  );
}
