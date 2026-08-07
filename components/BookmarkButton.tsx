"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { toggleBookmark } from "@/lib/actions/ally.actions";

interface BookmarkButtonProps {
  allyId: string;
  initialBookmarked: boolean;
}

const BookmarkButton = ({ allyId, initialBookmarked }: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !bookmarked;
    setBookmarked(nextState);

    startTransition(async () => {
      try {
        await toggleBookmark(allyId);
      } catch (error) {
        setBookmarked(!nextState);
        toast.error(
          error instanceof Error ? error.message : "Failed to update bookmark"
        );
      }
    });
  };

  return (
    <button
      className="companion-bookmark"
      onClick={handleClick}
      disabled={isPending}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Image
        src={bookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
        alt="bookmark"
        width={12.5}
        height={15}
      />
    </button>
  );
};

export default BookmarkButton;
