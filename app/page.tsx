import AllyCard from "@/components/AllyCard";
import AlliesList from "@/components/AlliesList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <main>
      <h1 className="text-2xl underline">Popular Allies</h1>
      <section className="home-section">
        <AllyCard
          id="1"
          name="Brian the Brain Explorer"
          topic="Neural Network of the Brain"
          subject="Science"
          duration={45}
          color="#ffda6e"
        />
        <AllyCard
          id="2"
          name="Countsy the Number Wizard"
          topic="Derivatice & Integrals"
          subject="Math"
          duration={30}
          color="#e5d0ff"
        />
        <AllyCard
          id="3"
          name="Felix the Word Builder"
          topic="Language"
          subject="English Literature"
          duration={30}
          color="#BDE7FF"
        />
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
