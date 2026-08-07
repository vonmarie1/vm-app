import { redirect } from "next/navigation";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

import AllyComponent from "@/components/AllyComponent";
import { getAlly } from "@/lib/actions/ally.actions";
import { getSubjectColor, getSubjectIcon } from "@/lib/utils";

interface AllySessionProps {
  params: Promise<{ id: string }>;
}

const AllySession = async ({ params }: AllySessionProps) => {
  const { id } = await params;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const ally = await getAlly(id);
  if (!ally) redirect("/allies");

  const { name, subject, topic, duration, voice, style } = ally;

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={getSubjectIcon(subject)}
              alt={subject}
              width={35}
              height={35}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{name}</p>
              <div className="subject-badge max-sm:hidden">{subject}</div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        <div className="items-start text-2xl max-md:hidden">
          {duration} minutes
        </div>
      </article>

      <AllyComponent
        companionId={id}
        subject={subject}
        topic={topic}
        name={name}
        userName={user.firstName || user.username || "You"}
        userImage={user.imageUrl}
        voice={voice}
        style={style}
        duration={duration}
      />
    </main>
  );
};

export default AllySession;
