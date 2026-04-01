import AllyCard from "@/components/AllyCard";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { getAllAllies } from "@/lib/actions/ally.actions";
import { getSubjectColor } from "@/lib/utils";

const AlliesLibrary = async ({ searchParams }: any) => {
  console.log("PAGE LOADED");

  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  console.log("FILTERS:", { subject, topic });

  const allies = await getAllAllies({ subject, topic });

  console.log("ALLIES:", allies);

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Allies Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className="companions-grid">
        {allies.map((ally) => (
          <AllyCard
            key={ally.id}
            {...ally}
            color={getSubjectColor(ally.subject)}
          />
        ))}
      </section>
    </main>
  );
};

export default AlliesLibrary;
