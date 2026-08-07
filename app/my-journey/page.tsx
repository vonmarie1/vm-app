import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import AllyCard from "@/components/AllyCard";
import {
  getAllyLimit,
  getBookmarkedAllies,
  getUserAllies,
} from "@/lib/actions/ally.actions";
import { getSubjectColor } from "@/lib/utils";

const Profile = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [allies, bookmarks, limit] = await Promise.all([
    getUserAllies(user.id),
    getBookmarkedAllies(user.id),
    getAllyLimit(),
  ]);

  const bookmarkedIds = new Set(bookmarks.map((ally) => ally.id));

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl}
            alt={user.fullName ?? "User"}
            width={110}
            height={110}
            className="rounded-lg"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">{user.fullName}</h1>
            <p className="text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border-2 border-black rounded-lg p-3 gap-2 flex flex-col items-center">
            <p className="text-2xl font-bold">
              {allies.length}
              {limit !== Infinity && (
                <span className="text-sm font-normal">/{limit}</span>
              )}
            </p>
            <p className="text-sm">Allies Created</p>
          </div>
          <div className="border-2 border-black rounded-lg p-3 gap-2 flex flex-col items-center">
            <p className="text-2xl font-bold">{bookmarks.length}</p>
            <p className="text-sm">Bookmarked</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 pt-8">
        <h2 className="font-bold text-2xl">My Allies</h2>
        {allies.length === 0 ? (
          <p>You haven&apos;t created any allies yet.</p>
        ) : (
          <div className="companions-grid">
            {allies.map((ally) => (
              <AllyCard
                key={ally.id}
                id={ally.id}
                name={ally.name}
                topic={ally.topic}
                subject={ally.subject}
                duration={ally.duration}
                color={getSubjectColor(ally.subject)}
                bookmarked={bookmarkedIds.has(ally.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4 pt-8">
        <h2 className="font-bold text-2xl">Bookmarked Allies</h2>
        {bookmarks.length === 0 ? (
          <p>You haven&apos;t bookmarked any allies yet.</p>
        ) : (
          <div className="companions-grid">
            {bookmarks.map((ally) => (
              <AllyCard
                key={ally.id}
                id={ally.id}
                name={ally.name}
                topic={ally.topic}
                subject={ally.subject}
                duration={ally.duration}
                color={getSubjectColor(ally.subject)}
                bookmarked
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
