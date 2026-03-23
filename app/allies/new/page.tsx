import AllyForm from "@/components/AllyForm";

const NewAlly = () => {
  return (
    <main className="lg:w-1/3 md:w-2/3 items-center justify-center">
      <article className="w-full gap-4 flex flex-col">
        <h1>Ally Builder</h1>
        <AllyForm />
      </article>
    </main>
  );
};

export default NewAlly;
