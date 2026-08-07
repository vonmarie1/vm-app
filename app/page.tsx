import { auth } from "@clerk/nextjs/server";

import AllyCard from "@/components/AllyCard";
import AlliesList from "@/components/AlliesList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";
import { getAllAllies, getBookmarkedAllyIds } from "@/lib/actions/ally.actions";
import { getSubjectColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { userId } = await auth();

  const [popularAllies, bookmarkedIds] = await Promise.all([
    getAllAllies({ limit: 3 }),
    userId ? getBookmarkedAllyIds(userId) : Promise.resolve([]),
  ]);

  return (
    <main>
      <h1 className="text-2xl underline">Popular Allies</h1>
      <section className="home-section">
        {popularAllies.length === 0 ? (
          <p>No allies yet — be the first to create one!</p>
        ) : (
          popularAllies.map((ally) => (
            <AllyCard
              key={ally.id}
              id={ally.id}
              name={ally.name}
              topic={ally.topic}
              subject={ally.subject}
              duration={ally.duration}
              color={getSubjectColor(ally.subject)}
              bookmarked={bookmarkedIds.includes(ally.id)}
            />
          ))
        )}
      </section>
      <section className="home-section">
        <AlliesList
          title="Recently completed sessions"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
