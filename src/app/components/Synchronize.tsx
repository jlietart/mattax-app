"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Synchronize() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentDate.getMonth(); // 0-11, so last month is current month - 1

  const [progressValue, setProgressValue] = useState(0);
  const [syncedAttachments, setSyncedAttachments] = useState(0);
  const [totalAttachments, setTotalAttachments] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [year, setYear] = useState<string>(currentYear.toString());
  const [month, setMonth] = useState<string>(
    (lastMonth === 0 ? 12 : lastMonth).toString()
  );
  const eventSourceRef = useRef<EventSource | null>(null);

  const startSync = (forceSync: boolean = false) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setProgressValue(0);
    setSyncedAttachments(0);
    setTotalAttachments(0);
    setIsSyncing(true);

    const eventSource = new EventSource(
      `/api/gmail/synchronize?year=${year}&month=${month}&force_sync=${forceSync}`
    );

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);

      if (data.event === "get_total") {
        setTotalAttachments(data.total);
      }

      if (data.event === "indexed" || data.event === "skipped") {
        setSyncedAttachments((prev) => prev + 1);
      }

      if (data.event === "end") {
        eventSource.close();
        setIsSyncing(false);
      }
    };

    eventSourceRef.current = eventSource;
  };

  useEffect(() => {
    if (totalAttachments > 0) {
      const newProgressValue = (syncedAttachments / totalAttachments) * 100;
      setProgressValue(Math.min(newProgressValue, 99));
    }

    if (syncedAttachments === totalAttachments && totalAttachments > 0) {
      setProgressValue(100);
    }
  }, [syncedAttachments, totalAttachments]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 gap-4">
        <Select onValueChange={setYear} defaultValue={year}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {[
              currentYear,
              currentYear - 1,
              currentYear - 2,
              currentYear - 3,
              currentYear - 4,
            ].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setMonth} defaultValue={month}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <SelectItem key={index} value={(index + 1).toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => startSync(false)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Process attachments
        </Button>
      </div>
      {isSyncing && (
        <div className="flex items-center justify-between mb-4 gap-4">
          <Progress value={progressValue} />
          <Badge>
            {syncedAttachments}/{totalAttachments}
          </Badge>
        </div>
      )}
    </div>
  );
}
