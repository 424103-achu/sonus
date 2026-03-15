import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { updateProfile, getUserById } from "../../services/userService";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import { useParams } from "react-router-dom";
import "../../index.css";
import { Pencil } from "lucide-react";

function Profile() {

  const { user, loading, setUser, refreshUser } = useAuth();
  const { id } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draftUser, setDraftUser] = useState(null);
  
  const isOwnProfile = !id || id === String(user?.user_id);
  
  useEffect(() => {
    refreshUser();
  }, []);
  
  /* LOAD PROFILE */
  useEffect(() => {
  
    if (loading) return;
  
    if (!id) {
      setProfile(user);
      return;
    }
  
    const fetchUser = async () => {
  
      try {
  
        const data = await getUserById(id);
        setProfile(data);
  
      } catch (err) {
  
        console.error(err);
  
      }
  
    };
  
    fetchUser();
  
  }, [id, user, loading]);
  if (loading) return null;
  if (!profile) return <p className="text-white">Loading...</p>;

  const data = editing ? draftUser : profile;

  const handleEdit = () => {

    setDraftUser({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      location: profile.location || "",
      dob: profile.dob || ""
    });

    setEditing(true);

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setDraftUser(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSave = async () => {

    try {

      const updatedUser = await updateProfile({
        ...draftUser,
        dob: draftUser.dob === "" ? null : draftUser.dob
      });

      setUser(updatedUser);
      setProfile(updatedUser);

      setEditing(false);
      setDraftUser(null);

    } catch (err) {

      console.error("Profile update failed:", err);

    }

  };

  const initials =
    (profile.first_name?.[0] || "") +
    (profile.last_name?.[0] || "") ||
    profile.username?.[0];

  const avatar =
    `https://ui-avatars.com/api/?name=${initials}&background=0b0b0d&color=fff&size=128`;

  const joinedDate =
    profile.joined_at
      ? new Date(profile.joined_at).toLocaleDateString()
      : "Unknown";

  const friends = 0;
  const closeFriends = 0;

  return (

    <div className="relative w-full min-h-screen flex flex-col text-white overflow-hidden">

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#0b0b0d] to-black"></div>

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <main className="flex-1 px-6 pt-28 pb-16">

        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">

            <img
              src={avatar}
              alt="avatar"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-red-600 shadow-xl object-cover"
            />

            <div className="flex-1 flex flex-col gap-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-3xl font-bold">
                    {profile.username}
                  </h2>

                  <p className="text-gray-400">
                    {profile.first_name || profile.last_name
                      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                      : "No name added"}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold transition">
                    Resume
                  </button>

                  {isOwnProfile && !editing && (

                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 border border-white/40 hover:bg-white/10 px-5 py-2 rounded-md transition"
                    >
                      <Pencil size={16}/>
                      Edit
                    </button>

                  )}

                  {isOwnProfile && editing && (

                    <button
                      onClick={handleSave}
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md"
                    >
                      Save
                    </button>

                  )}

                </div>

              </div>

              <div className="flex gap-12">

                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl font-bold">
                    {closeFriends}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Close Friends
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl font-bold">
                    {friends}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Friends
                  </span>
                </div>

              </div>

            </div>

          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-xl">

            <Field label="First Name" name="first_name" value={data.first_name} editing={editing} onChange={handleChange} />
            <Field label="Last Name" name="last_name" value={data.last_name} editing={editing} onChange={handleChange} />

            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p>{profile.email}</p>
            </div>

            <Field label="Phone" name="phone" value={data.phone} editing={editing} onChange={handleChange} />
            <Field label="Gender" name="gender" value={data.gender} editing={editing} onChange={handleChange} />
            <Field label="Location" name="location" value={data.location} editing={editing} onChange={handleChange} />
            <Field label="DOB" name="dob" value={data.dob || ""} editing={editing} onChange={handleChange} />

            <div>
              <p className="text-gray-400 text-sm">Joined</p>
              <p>{joinedDate}</p>
            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>

  );

}

function Field({ label, name, value, editing, onChange }) {

  return (

    <div>

      <p className="text-gray-400 text-sm">{label}</p>

      {editing ? (

        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="bg-black/40 border border-white/10 px-3 py-2 rounded w-full"
        />

      ) : (

        <p>{value || "Not added"}</p>

      )}

    </div>

  );

}

export default Profile;