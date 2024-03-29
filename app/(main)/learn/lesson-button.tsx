"use client";

import Link from "next/link";
import { Check, Crown, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
};

type RenderStartButtonProps = {
  percentage: number;
  Icon: any;
  locked?: boolean;
  isCompleted: boolean;
};

const calculateIndentationLevel = (cycleIndex: number): number => {
  if (cycleIndex <= 2) {
    return cycleIndex;
  } else if (cycleIndex <= 4) {
    return 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    return 4 - cycleIndex;
  } else {
    return cycleIndex - 8;
  }
};

const renderStartButton = ({
  percentage,
  Icon,
  locked,
  isCompleted,
}: RenderStartButtonProps) => (
  <div className="h-[102px] w-[102px] relative">
    <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
      Start
      <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
    </div>
    <CircularProgressbarWithChildren
      value={Number.isNaN(percentage) ? 0 : percentage}
      styles={{
        path: {
          stroke: "#4ade80",
        },
        trail: {
          stroke: "#e5e7eb",
        },
      }}
    >
      <Button
        size="rounded"
        variant={locked ? "locked" : "secondary"}
        className="h-[70px] w-[70px] border-b-8"
      >
        <Icon
          className={cn(
            "h-10 w-10",
            locked
              ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
              : "fill-primary-foreground text-primary-foreground",
            isCompleted && "fill-none stroke-[4]"
          )}
        />
      </Button>
    </CircularProgressbarWithChildren>
  </div>
);

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
}: Props) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  const indentationLevel = calculateIndentationLevel(cycleIndex);

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  let Icon;
  if (isCompleted) {
    Icon = Check;
  } else if (isLast) {
    Icon = Crown;
  } else {
    Icon = Star;
  }

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  return (
    <Link
      href={href}
      aria-disabled={locked}
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          renderStartButton({
            percentage,
            Icon,
            locked,
            isCompleted,
          })
        ) : (
          <Button
            size="rounded"
            variant={locked ? "locked" : "secondary"}
            className="h-[70px] w-[70px] border-b-8"
          >
            <Icon
              className={cn(
                "h-10 w-10",
                locked
                  ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                  : "fill-primary-foreground text-primary-foreground",
                isCompleted && "fill-none stroke-[4]"
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
