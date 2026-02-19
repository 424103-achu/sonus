import Navbar from "./components/Navbar";
import "../../index.css";
import IconLink from "./components/iconlink";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
function Profile() {
  return (
    <div className="w-full h-full bg-[#0b0b0d] text-white">
      <Navbar
        links={[
          { name: "Home", path: "/" },
          { name: "Sign Up", path: "/signup" },
        ]}
      > 
       <IconLink to="/" icon={HomeIcon} label="Home" />
      </Navbar>
        
    </div>
  );
}
export default Profile;
