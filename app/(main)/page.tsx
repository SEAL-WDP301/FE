import HeroSection from "./components/hero_section";
import StatsSection from "./components/stats_section";
import AboutSealSection from "./components/about_section";
import CategoriesSection from "./components/categories_section";
import FAQSection from "./components/FAQ_section";
import CompetitionFlowSection from "./components/flow_section";
import JudgesSection from "./components/judge_section";
import RankingSection from "./components/ranking_section";
import SealSeasonsSection from "./components/sesson_section";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <section id="about">
        <AboutSealSection />
      </section>
      <section id="events">
        <SealSeasonsSection />
      </section>
      <CompetitionFlowSection />
      <section id="categories">
        <CategoriesSection />
      </section>
      <section id="rankings">
        <RankingSection />
      </section>
      <JudgesSection />
      <section id="FAQ">
        <FAQSection />
      </section>
    </div>
  );
}
