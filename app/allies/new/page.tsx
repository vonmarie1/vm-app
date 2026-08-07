import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import AllyForm from "@/components/AllyForm";
import { getAllyLimit, getUserAlliesCount } from "@/lib/actions/ally.actions";
import { cn } from "@/lib/utils";

const NewAlly = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const limit = await getAllyLimit();
  const alliesCount = await getUserAlliesCount(userId);
  const hasReachedLimit = alliesCount >= limit;

  if (hasReachedLimit) {
    return (
      <main>
        <article className="companion-limit">
          <Image
            src="/images/limit.svg"
            alt="Ally limit reached"
            width={360}
            height={230}
          />
          <div className="cta-badge">Upgrade your plan</div>
          <h1>You&apos;ve reached your limit</h1>
          <p>
            You&apos;ve used {alliesCount} of {limit} allies available on
            your plan. Upgrade to create more allies and unlock other
            premium features.
          </p>
          <Link href="/subscription" className="btn-primary w-full justify-center">
            Upgrade My Plan
          </Link>
        </article>
      </main>
    );
  }

  const remaining = limit - alliesCount;

  return (
    <main className="lg:w-1/3 md:w-2/3 items-center justify-center">
      <article className="w-full gap-4 flex flex-col">
        <h1>Ally Builder</h1>
        {limit !== Infinity && (
          <div
            className={cn(
              "cta-badge w-fit",
              remaining <= 1 && "bg-orange-200 text-orange-900"
            )}
          >
            {alliesCount} of {limit} allies used
            {remaining === 1 && " — this is your last one on this plan"}
          </div>
        )}
        <AllyForm />
      </article>
    </main>
  );
};

export default NewAlly;
