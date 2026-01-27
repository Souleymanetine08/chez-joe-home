import SimpleHeader from "@/components/SimpleHeader";
import RamadanHero from "@/components/RamadanHero";
import RamadanCatalog from "@/components/RamadanCatalog";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1">
        <RamadanHero />
        <RamadanCatalog />
      </main>
      <SimpleFooter />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default Index;
