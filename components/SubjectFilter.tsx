"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SubjectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("subject") || "all";

  const [subject, setSubject] = useState(query);

  // Keep state in sync if URL changes externally
  useEffect(() => {
    setSubject(query);
  }, [query]);

  // Update URL when subject changes
  useEffect(() => {
    const currentParams = searchParams.toString();
    let newUrl = "";

    if (subject === "all") {
      newUrl = removeKeysFromUrlQuery({
        params: currentParams,
        keysToRemove: ["subject"],
      });
    } else {
      newUrl = formUrlQuery({
        params: currentParams,
        key: "subject",
        value: subject,
      });
    }

    if (newUrl !== currentParams) {
      router.push(newUrl, { scroll: false });
    }
  }, [subject, searchParams, router]);

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All subjects</SelectItem>
        {subjects.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
