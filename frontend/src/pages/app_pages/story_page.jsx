import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";

function StoryPage() {

  const DEFAULT_PHOTO =
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80";

  /* simulated database */
  const userDatabase = {
    zia: {
      username: "zia",
      name: "Zia Khan",
      descriptor: "Spark",
      highlight: "Best meme partner",
      photo: DEFAULT_PHOTO
    },
    alex: {
      username: "alex",
      name: "Alex Rivera",
      descriptor: "Chaos",
      highlight: "Adventure planner",
      photo: DEFAULT_PHOTO
    }
  };

  const [friends, setFriends] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    username: "",
    name: "",
    descriptor: "",
    highlight: "",
    photo: ""
  });

  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState(false);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    index: null
  });

  useEffect(() => {
    const closeMenu = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));

    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* username auto check */
  const handleUsernameChange = (value) => {

    setForm({ ...form, username: value });
    setConfirmUser(false);
    setFoundUser(null);

    if (!value) return;

    setLoading(true);

    setTimeout(() => {

      const result = userDatabase[value.toLowerCase()];

      setLoading(false);

      if (result) {
        setFoundUser(result);
        setConfirmUser(true);
      }

    }, 1000);
  };

  const confirmSelection = () => {

    setForm({
      username: foundUser.username,
      name: foundUser.name,
      descriptor: foundUser.descriptor,
      highlight: foundUser.highlight,
      photo: foundUser.photo
    });

    setConfirmUser(false);
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const newFriend = {
      ...form,
      photo: form.photo || DEFAULT_PHOTO
    };

    if (editingIndex !== null) {
      const updated = [...friends];
      updated[editingIndex] = newFriend;
      setFriends(updated);
    } else {
      setFriends([...friends, newFriend]);
    }

    setOpenModal(false);
  };

  const deleteFriend = (index) => {
    const updated = friends.filter((_, i) => i !== index);
    setFriends(updated);
  };

  const editFriend = (index) => {
    setEditingIndex(index);
    setForm(friends[index]);
    setOpenModal(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white bg-black overflow-hidden">

      {/* background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      {/* HERO */}
      <header className="pt-32 pb-20 text-center">

        <p className="uppercase tracking-widest text-gray-400">
          Mine
        </p>

        <h1 className="text-5xl font-bold bg-red-600 px-6 py-2 inline-block rounded-lg">
          ALL MINE
        </h1>

      </header>

      <main className="flex-1 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-3 gap-8">

            {/* ADD CARD */}
            <button
              onClick={() => {
                setEditingIndex(null);
                setForm({
                  username: "",
                  name: "",
                  descriptor: "",
                  highlight: "",
                  photo: ""
                });
                setOpenModal(true);
              }}
              className="group border border-white/20 hover:border-red-600
              rounded-xl p-12 flex flex-col items-center justify-center
              transition hover:-translate-y-1 hover:shadow-xl"
            >

              <span className="text-5xl mb-3 text-red-500 group-hover:scale-110 transition">
                +
              </span>

              <p className="text-gray-400 group-hover:text-white">
                Add Close Friend
              </p>

            </button>

            {/* FRIEND CARDS */}
            {friends.map((friend, index) => {

              let pressTimer;

              const startPress = (e) => {
                pressTimer = setTimeout(() => {
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    index
                  });
                }, 600);
              };

              const cancelPress = () => clearTimeout(pressTimer);

              return (
                <div
                  key={index}

                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.clientX,
                      y: e.clientY,
                      index
                    });
                  }}

                  onMouseDown={startPress}
                  onMouseUp={cancelPress}
                  onMouseLeave={cancelPress}
                  onTouchStart={startPress}
                  onTouchEnd={cancelPress}

                  className="relative rounded-xl overflow-hidden cursor-pointer
                  border border-white/10 hover:border-red-600
                  transition hover:-translate-y-1 hover:shadow-2xl"
                >

                  <img
                    src={friend.photo}
                    alt={friend.name}
                    className="w-full h-52 object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40"></div>

                  <div className="absolute bottom-0 p-4">

                    <h3 className="text-lg font-semibold">
                      {friend.name}
                    </h3>

                    <p className="text-gray-300 text-sm">
                      {friend.descriptor}
                    </p>

                    <small className="text-gray-400">
                      {friend.highlight}
                    </small>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </main>

      {/* CONTEXT MENU */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-[#0b0b0d] border border-white/10 rounded-lg shadow-lg"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >

          <button
            onClick={() => {
              editFriend(contextMenu.index);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="block px-4 py-2 hover:bg-white/10 w-full text-left"
          >
            Edit
          </button>

          <button
            onClick={() => {
              deleteFriend(contextMenu.index);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="block px-4 py-2 hover:bg-red-600 w-full text-left"
          >
            Delete
          </button>

        </div>
      )}

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <div className="bg-[#0b0b0d] border border-white/10 p-6 rounded-xl w-[420px]">

            <h3 className="text-xl font-semibold mb-4">
              Add Close Friend
            </h3>

            {/* USERNAME SEARCH */}
            <input
              placeholder="Enter Username"
              className="p-2 w-full bg-black border border-white/20 rounded mb-3"
              value={form.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />

            {/* LOADING */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">

                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>

                Checking username...

              </div>
            )}

            {/* CONFIRM USER */}
            {confirmUser && foundUser && (

              <div className="border border-white/10 p-3 rounded mb-4">

                <p className="text-sm text-gray-400 mb-2">
                  User found. Is this them?
                </p>

                <div className="flex items-center gap-3">

                  <img
                    src={foundUser.photo}
                    className="w-10 h-10 rounded-full"
                  />

                  <div>
                    <p className="font-semibold">
                      {foundUser.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      @{foundUser.username}
                    </p>
                  </div>

                </div>

                <div className="flex gap-3 mt-3">

                  <button
                    onClick={confirmSelection}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Yes
                  </button>

                  <button
                    onClick={() => setConfirmUser(false)}
                    className="border border-white/20 px-3 py-1 rounded"
                  >
                    No
                  </button>

                </div>

              </div>

            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              <input
                required
                placeholder="Name"
                className="p-2 bg-black border border-white/20 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                required
                placeholder="Descriptor"
                className="p-2 bg-black border border-white/20 rounded"
                value={form.descriptor}
                onChange={(e) =>
                  setForm({ ...form, descriptor: e.target.value })
                }
              />

              <textarea
                required
                placeholder="Highlight"
                className="p-2 bg-black border border-white/20 rounded"
                value={form.highlight}
                onChange={(e) =>
                  setForm({ ...form, highlight: e.target.value })
                }
              />

              <input
                placeholder="Photo URL"
                className="p-2 bg-black border border-white/20 rounded"
                value={form.photo}
                onChange={(e) =>
                  setForm({ ...form, photo: e.target.value })
                }
              />

              <div className="flex gap-3 mt-3">

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="border border-white/20 px-4 py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <Footer />

    </div>
  );
}

export default StoryPage;