import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import "../../index.css";
import { Pencil } from "lucide-react";

function Profile() {
  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8901",
    username: "johndoe",
    dob: "1998-05-15",
    gender: "Male",
    location: "New York, USA",
    joined: "January 2024",
    friends: 42,
    closeFriends: 12,
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=0b0b0d&color=fff&size=128",
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#0b0b0d] to-black"></div>

      {/* red glow lights */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <main className="flex-1 px-6 pt-28 pb-16">

        <div className="max-w-5xl mx-auto">

          {/* PROFILE HEADER */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">

            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 shadow-xl object-cover"
            />

            {/* User Info */}
            <div className="flex-1 flex flex-col gap-5">

              {/* Username + Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-3xl font-bold">{user.username}</h2>
                  <p className="text-gray-400">{user.name}</p>
                </div>

                <div className="flex gap-3">

                  <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold transition">
                    Resume
                  </button>

                  <button className="flex items-center gap-2 border border-white/40 hover:bg-white/10 px-5 py-2 rounded-md transition">
                    <Pencil size={16} />
                    Edit
                  </button>

                </div>

              </div>

              {/* Stats */}
              <div className="flex gap-12">

                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl font-bold">
                    {user.closeFriends}
                  </span>
                  <span className="text-gray-400 text-sm">Close Friends</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl font-bold">
                    {user.friends}
                  </span>
                  <span className="text-gray-400 text-sm">Friends</span>
                </div>

              </div>

            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-xl">

            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p>{user.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p>{user.phone}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Date of Birth</p>
              <p>{user.dob}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Gender</p>
              <p>{user.gender}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Location</p>
              <p>{user.location}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Joined</p>
              <p>{user.joined}</p>
            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Profile;