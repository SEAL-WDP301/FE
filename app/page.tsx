import HeroSection from "@/components/home_section/hero_section";
import StatsSection from "@/components/home_section/stats_section";
import SeasonsSection from "@/components/home_section/sesson_section";
import AboutSection from "@/components/home_section/about_section";
import FlowSection from "@/components/home_section/flow_section";
import CategoriesSection from "@/components/home_section/categories_section";
import RankingSection from "@/components/home_section/ranking_section";
import JudgesSection from "@/components/home_section/judge_section";
import FAQSection from "@/components/home_section/FAQ_section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <section id="about">
        <AboutSection />
      </section>
      <section id="events">
        <SeasonsSection />
      </section>
      <FlowSection />
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
