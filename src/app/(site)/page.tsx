import IntroSection from "./_components/intro-section";
import OriginStorySection from "./_components/origin-story-section";
import ProductOverviewSection from "./_components/product-overview-section";
import RoadmapSection from "./_components/roadmap-section";
import SiteFooter from "./_components/site-footer";

const repositoryUrl = "https://github.com/arhamkhnz/tenderlayer";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <main className="flex flex-col gap-8" id="main-content">
        <IntroSection repositoryUrl={repositoryUrl} />
        <ProductOverviewSection />
        <OriginStorySection />
        <RoadmapSection />
      </main>
      <SiteFooter repositoryUrl={repositoryUrl} />
    </div>
  );
}
