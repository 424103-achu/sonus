import Navbar from "./components/Navbar";
import "../../index.css";
import StoryGrid from "../../components/story/storyGrid";
function Home() {
  return (
    <div className="w-full h-full bg-[#0b0b0d] text-white">
      <Navbar></Navbar>
            <StoryGrid />
    </div>
  );
}
export default Home;
