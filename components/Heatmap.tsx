"use client";

import React, { useMemo, useState, useRef } from "react";
import { Habit } from "@/types";
import { generateHeatmapData, chunkHeatmapIntoWeeks, HeatmapDay } from "@/utils/generateHeatmap";
import { formatDateFriendly, parseLocalDateString } from "@/utils/dateHelpers";
import Tooltip from "./Tooltip";

interface HeatmapProps {
  habits: Habit[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ habits }) => {
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    content: React.ReactNode;
    x: number;
    y: number;
  }>({
    visible: false,
    content: null,
    x: 0,
    y: 0,
  });

  const heatmapRef = useRef<HTMLDivElement>(null);

  // Generate last 77 days data
  const heatmapData = useMemo(() => {
    return generateHeatmapData(habits, 77);
  }, [habits]);

  // Chunk into 11 weeks of 7 days
  const weeks = useMemo(() => {
    return chunkHeatmapIntoWeeks(heatmapData);
  }, [heatmapData]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, day: HeatmapDay) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Position tooltip above the hovered square
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const formattedDate = formatDateFriendly(day.date, true);
    
    const content = (
      <div className="flex flex-col gap-0.5 select-none text-left">
        <span className="font-semibold text-foreground dark:text-neutral-100">{formattedDate}</span>
        <span className="text-muted-foreground text-[10px]">
          Completed {day.completedCount} of {day.totalCount} {day.totalCount === 1 ? "habit" : "habits"}
        </span>
        <span className="font-bold text-primary mt-0.5">{day.percentage}% completed</span>
      </div>
    );

    setTooltipState({
      visible: true,
      content,
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setTooltipState((prev) => ({ ...prev, visible: false }));
  };

  // Determine Month Labels and their column offsets
  const monthLabels = useMemo(() => {
    const labels: { text: string; offsetIndex: number }[] = [];
    let lastMonthName = "";

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      const dateObj = parseLocalDateString(firstDay.date);
      const monthName = dateObj.toLocaleString("en-US", { month: "short" });

      // If month changes, record it
      if (monthName !== lastMonthName) {
        lastMonthName = monthName;
        labels.push({ text: monthName, offsetIndex: weekIndex });
      }
    });

    return labels;
  }, [weeks]);

  // Day of week labels (Sun, Mon, Tue, etc. - we render labels for Mon, Wed, Fri for a clean GitHub layout)
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xs select-none relative overflow-hidden" ref={heatmapRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Activity Grid</h3>
          <p className="text-xs text-muted-foreground">Your performance over the last 77 days</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] level-0 border border-border/10" />
          <div className="w-3 h-3 rounded-[2px] level-1 border border-border/10" />
          <div className="w-3 h-3 rounded-[2px] level-2 border border-border/10" />
          <div className="w-3 h-3 rounded-[2px] level-3 border border-border/10" />
          <div className="w-3 h-3 rounded-[2px] level-4 border border-border/10" />
          <span>More</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex items-start">
        {/* Day of Week Labels */}
        <div className="flex flex-col justify-between h-[116px] text-[9px] text-muted-foreground/70 font-semibold mr-2 mt-4 select-none pr-1 w-3.5">
          <span></span>
          <span>M</span>
          <span></span>
          <span>W</span>
          <span></span>
          <span>F</span>
          <span></span>
        </div>

        {/* Heatmap Grid + Month Labels */}
        <div className="flex-1 overflow-x-auto pb-1 scrollbar-none">
          {/* Month Labels row */}
          <div className="h-4 relative mb-1 text-[9px] font-bold text-muted-foreground/80 w-[220px]">
            {monthLabels.map((label, idx) => (
              <span
                key={`${label.text}-${idx}`}
                className="absolute transform transition-all duration-200"
                style={{ left: `${label.offsetIndex * 20}px` }}
              >
                {label.text}
              </span>
            ))}
          </div>

          {/* Grid Layout */}
          <div className="flex gap-[6px] w-fit">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[6px] shrink-0">
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-3.5 h-3.5 rounded-[3px] level-${day.level} border border-border/5 hover:scale-115 hover:ring-1 hover:ring-foreground/20 active:scale-95 transition-all duration-150 cursor-pointer`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Tooltip */}
      <Tooltip
        visible={tooltipState.visible}
        content={tooltipState.content}
        x={tooltipState.x}
        y={tooltipState.y}
      />
    </div>
  );
};

export default Heatmap;
