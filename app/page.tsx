import { Approach } from "@/components/approach";
import { Clients } from "@/components/clients";
import { Experience } from "@/components/experience";
import { RecentExperience } from "@/components/recent-experience";
import { Footer } from "@/components/footer";
import { Grid } from "@/components/grid";
import { Hero } from "@/components/hero";
import { FloatingNav } from "@/components/ui/floating-nav";
import { RecentProjects } from "@/components/recent-projects";
import { navItems } from "@/data";

const MainPage = () => {
  return (
    <main className="relative mx-auto flex flex-col items-center justify-center overflow-clip bg-black-100 px-5 sm:px-10">
      <FloatingNav navItems={navItems} />

      <div className="w-full md:max-w-3xl lg:max-w-5xl">
        <Hero />
        {/* <Grid /> */}
        {/* <Experience /> */}
        <RecentExperience />
        {/* <RecentProjects /> */}
        <Clients />
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default MainPage;
