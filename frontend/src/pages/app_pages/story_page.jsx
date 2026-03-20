import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "../auth_pages/components/Footer";
import ErrorModal from "../../components/ErrorModal";
import { getCloseFriends, addCloseFriend, removeCloseFriend } from "../../services/friendService.js";
import {
  getStoryItems,
  getStoryItemsForUser,
  addStoryItem,
  removeStoryItem,
  updateStoryItem,
  getComfortZoneItems,
  getComfortZoneItemsForUser,
  addComfortZoneItem,
  removeComfortZoneItem,
  updateComfortZoneItem,
} from "../../services/storyService.js";
import { searchUsers } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { storiesData } from "../../data/stories";

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80";

const INTERACTIVE_STORIES = new Set([
  "close-friends",
  "friends",
  "creative-works",
  "school",
  "graduation",
  "comfort-zone",
]);

const GRADUATION_REGEX =
  /(bachelor|master|phd|degree|diploma|b\.?tech|m\.?tech|mba|bsc|msc|ba|ma)/i;

function StoryPage() {
  const { storyId, userId } = useParams();
  const { user } = useAuth();
  const selectedStory = storiesData.find((story) => story.id === storyId);
  const routeUserId = Number(userId);
  const viewerUserId = Number(user?.user_id);
  const isOwnerView = !Number.isNaN(routeUserId) && routeUserId === viewerUserId;
  const isReadOnlyView = !isOwnerView;

  const isCloseFriendsStory = selectedStory?.id === "close-friends";
  const isFriendsStory = selectedStory?.id === "friends";
  const isPeopleStory = isCloseFriendsStory || isFriendsStory;
  const isComfortZoneStory = selectedStory?.id === "comfort-zone";
  const isManagedStory = Boolean(selectedStory?.id && INTERACTIVE_STORIES.has(selectedStory.id));

  const pressTimerRef = useRef(null);

  const [friends, setFriends] = useState([]);
  const [items, setItems] = useState([]);
  const [comfortItems, setComfortItems] = useState({ movies: [], foods: [] });

  const [openModal, setOpenModal] = useState(false);
  const [comfortModalType, setComfortModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    code: null,
    title: "Error",
    message: "",
  });

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    index: null,
    itemType: null,
  });

  const [form, setForm] = useState({
    username: "",
    name: "",
    descriptor: "",
    highlight: "",
    photo: "",
    project_name: "",
    description: "",
    role: "",
    joined_at: "",
    school_name: "",
    place: "",
    degree: "",
    field: "",
    start_year: "",
    end_year: "",
    comment: "",
    comfort_name: "",
    comfort_comment: "",
  });

  const [foundUser, setFoundUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState(false);

  const openError = useCallback((title, message, code = null) => {
    setErrorModal({ isOpen: true, title, message, code });
  }, [setErrorModal]);

  const isEditing = Boolean(editingItem);

  const resetModalState = () => {
    setForm({
      username: "",
      name: "",
      descriptor: "",
      highlight: "",
      photo: "",
      project_name: "",
      description: "",
      role: "",
      joined_at: "",
      school_name: "",
      place: "",
      degree: "",
      field: "",
      start_year: "",
      end_year: "",
      comment: "",
      comfort_name: "",
      comfort_comment: "",
    });
    setFoundUser(null);
    setConfirmUser(false);
  };

  const loadManagedItems = useCallback(async () => {
    if (!selectedStory) {
      return;
    }

    try {
      if (isPeopleStory) {
        let data;

        if (isReadOnlyView) {
          data = await getStoryItemsForUser(routeUserId, selectedStory.id);
        } else {
          data = isCloseFriendsStory ? await getCloseFriends() : await getStoryItems("friends");
        }

        const formatted = data.map((u) => ({
          friend_id: u.friend_id || u.user_id,
          username: u.username,
          name:
            u.name?.trim() ||
            `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
            u.username,
          descriptor: "",
          highlight: "",
          photo: DEFAULT_PHOTO,
        }));

        setFriends(formatted);
        return;
      }

      if (isComfortZoneStory) {
        const [movies, foods] = isReadOnlyView
          ? await Promise.all([
              getComfortZoneItemsForUser(routeUserId, "movies"),
              getComfortZoneItemsForUser(routeUserId, "foods"),
            ])
          : await Promise.all([getComfortZoneItems("movies"), getComfortZoneItems("foods")]);
        setComfortItems({ movies, foods });
        return;
      }

      const data = isReadOnlyView
        ? await getStoryItemsForUser(routeUserId, selectedStory.id)
        : await getStoryItems(selectedStory.id);
      setItems(data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load content";
      openError("Load Error", msg, err.response?.status || null);
    }
  }, [
    selectedStory,
    isPeopleStory,
    isReadOnlyView,
    routeUserId,
    isCloseFriendsStory,
    isComfortZoneStory,
    openError,
  ]);

  useEffect(() => {
    if (!isManagedStory) {
      return;
    }

    queueMicrotask(() => {
      void loadManagedItems();
    });
  }, [isManagedStory, loadManagedItems]);

  useEffect(() => {
    const closeMenu = () =>
      setContextMenu((prev) => ({ ...prev, visible: false, itemType: null }));

    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleUsernameChange = async (value) => {
    setForm((prev) => ({ ...prev, username: value }));
    setConfirmUser(false);
    setFoundUser(null);

    if (!value) {
      return;
    }

    try {
      setLoading(true);
      const users = await searchUsers(value);
      setLoading(false);

      if (users.length > 0) {
        const u = users[0];
        setFoundUser({
          user_id: u.user_id,
          username: u.username,
          name: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
          photo: DEFAULT_PHOTO,
        });
        setConfirmUser(true);
      }
    } catch (err) {
      setLoading(false);
      openError("Search Error", "Failed to search user", err.response?.status || null);
    }
  };

  const confirmSelection = () => {
    if (!foundUser) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      username: foundUser.username,
      name: foundUser.name,
      photo: DEFAULT_PHOTO,
    }));
    setConfirmUser(false);
  };

  const getEducationTypeByDegree = (degree = "") =>
    GRADUATION_REGEX.test(degree) ? "graduation" : "school";

  const openAddModal = (itemType = null) => {
    setEditingItem(null);
    setComfortModalType(itemType);
    resetModalState();
    setOpenModal(true);
  };

  const openEditModal = (index, itemType = null) => {
    if (isComfortZoneStory) {
      const target = comfortItems[itemType]?.[index];

      if (!target) {
        return;
      }

      setEditingItem({ type: "comfort", itemType, index, id: target.id });
      setComfortModalType(itemType);
      setForm((prev) => ({
        ...prev,
        comfort_name: target.name || "",
        comfort_comment: target.comment || "",
      }));
      setFoundUser(null);
      setConfirmUser(false);
      setOpenModal(true);
      return;
    }

    if (isPeopleStory) {
      const friend = friends[index];

      if (!friend) {
        return;
      }

      setEditingItem({ type: "people", index, id: friend.friend_id });
      setForm((prev) => ({
        ...prev,
        username: friend.username || "",
        name: friend.name || "",
        descriptor: friend.descriptor || "",
        highlight: friend.highlight || "",
        photo: friend.photo || "",
      }));
      setFoundUser(null);
      setConfirmUser(false);
      setOpenModal(true);
      return;
    }

    const target = items[index];

    if (!target) {
      return;
    }

    setEditingItem({ type: "story", index, id: target.id });

    if (selectedStory?.id === "creative-works") {
      setForm((prev) => ({
        ...prev,
        project_name: target.project_name || "",
        description: target.description || "",
        role: target.role || "",
        joined_at: target.joined_at ? String(target.joined_at).slice(0, 10) : "",
      }));
    }

    if (selectedStory?.id === "school" || selectedStory?.id === "graduation") {
      setForm((prev) => ({
        ...prev,
        school_name: target.school_name || "",
        place: target.place || "",
        degree: target.degree || "",
        field: target.field || "",
        start_year: target.start_year || "",
        end_year: target.end_year || "",
        comment: target.comment || "",
      }));
    }

    setFoundUser(null);
    setConfirmUser(false);
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReadOnlyView) {
      openError("Read Only", "You can only view this story", 403);
      return;
    }

    try {
      if (isComfortZoneStory) {
        const name = form.comfort_name.trim();

        if (!comfortModalType) {
          openError("Validation", "Select movies or foods first", 400);
          return;
        }

        if (!name) {
          openError("Validation", "Name is required", 400);
          return;
        }

        const exists = comfortItems[comfortModalType].some((item) => {
          if (isEditing && editingItem?.type === "comfort" && item.id === editingItem.id) {
            return false;
          }

          return item.name?.toLowerCase() === name.toLowerCase();
        });

        if (exists) {
          openError("Already Added", `${name} already exists in your favorite ${comfortModalType}`, 409);
          return;
        }

        if (isEditing && editingItem?.type === "comfort") {
          await updateComfortZoneItem(comfortModalType, editingItem.id, {
            name,
            comment: form.comfort_comment.trim(),
          });
        } else {
          await addComfortZoneItem(comfortModalType, {
            name,
            comment: form.comfort_comment.trim(),
          });
        }

        await loadManagedItems();
        setOpenModal(false);
        setComfortModalType(null);
        setEditingItem(null);
        resetModalState();
        return;
      }

      if (isPeopleStory) {
        if (isEditing && editingItem?.type === "people") {
          setFriends((prev) =>
            prev.map((entry, idx) =>
              idx === editingItem.index
                ? {
                    ...entry,
                    name: form.name.trim(),
                    descriptor: form.descriptor.trim(),
                    highlight: form.highlight.trim(),
                    photo: form.photo.trim() || DEFAULT_PHOTO,
                  }
                : entry
            )
          );
        } else {
          if (!foundUser) {
            return;
          }

          const isDuplicate = friends.some((f) => f.username === foundUser.username);
          if (isDuplicate) {
            openError(
              "Already Added",
              `This user is already in your ${selectedStory?.title?.toLowerCase() || "friends"} list!`,
              409
            );
            return;
          }

          const saved = isCloseFriendsStory
            ? await addCloseFriend(foundUser.user_id)
            : await addStoryItem("friends", { friend_id: foundUser.user_id });

          const newFriend = {
            friend_id: saved.friend_id || saved.id || foundUser.user_id,
            username: foundUser.username,
            name: form.name,
            descriptor: form.descriptor,
            highlight: form.highlight,
            photo: form.photo || DEFAULT_PHOTO,
          };

          setFriends((prev) => [...prev, newFriend]);
        }

        setOpenModal(false);
        setEditingItem(null);
        resetModalState();
        return;
      }

      if (!selectedStory) {
        return;
      }

      if (selectedStory.id === "creative-works") {
        if (!form.project_name.trim()) {
          openError("Validation", "Project name is required", 400);
          return;
        }

        const payload = {
          project_name: form.project_name.trim(),
          description: form.description.trim(),
          role: form.role.trim(),
          joined_at: form.joined_at || null,
        };

        if (isEditing && editingItem?.type === "story") {
          await updateStoryItem("creative-works", editingItem.id, payload);
        } else {
          await addStoryItem("creative-works", payload);
        }
      }

      if (selectedStory.id === "school" || selectedStory.id === "graduation") {
        if (!form.school_name.trim()) {
          openError("Validation", "School name is required", 400);
          return;
        }

        const educationType = getEducationTypeByDegree(form.degree);
        if (educationType !== selectedStory.id) {
          openError(
            "Validation",
            `Degree maps to ${educationType}. Please add this entry in the ${educationType} card.`,
            400
          );
          return;
        }

        const payload = {
          school_name: form.school_name.trim(),
          place: form.place.trim(),
          degree: form.degree.trim(),
          field: form.field.trim(),
          start_year: form.start_year ? Number(form.start_year) : null,
          end_year: form.end_year ? Number(form.end_year) : null,
          comment: form.comment.trim(),
        };

        if (isEditing && editingItem?.type === "story") {
          await updateStoryItem(selectedStory.id, editingItem.id, payload);
        } else {
          await addStoryItem(selectedStory.id, payload);
        }
      }

      await loadManagedItems();
      setOpenModal(false);
      setEditingItem(null);
      resetModalState();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to save data";
      openError("Save Error", errorMsg, err.response?.status || null);
    }
  };

  const deleteEntry = async (index) => {
    try {
      if (isComfortZoneStory) {
        const itemType = contextMenu.itemType;

        if (!itemType) {
          openError("Delete Error", "Could not identify item type", 400);
          return;
        }

        const selectedItem = comfortItems[itemType][index];

        if (!selectedItem) {
          openError("Delete Error", "Item not found", 404);
          return;
        }

        await removeComfortZoneItem(itemType, selectedItem.id);
        await loadManagedItems();
        return;
      }

      if (isPeopleStory) {
        const friend = friends[index];

        if (isCloseFriendsStory) {
          await removeCloseFriend(friend.friend_id);
        } else {
          await removeStoryItem("friends", friend.friend_id);
        }

        await loadManagedItems();
        return;
      }

      if (!selectedStory) {
        return;
      }

      const item = items[index];
      await removeStoryItem(selectedStory.id, item.id);
      await loadManagedItems();
    } catch (err) {
      openError(
        "Delete Error",
        err.response?.data?.message || "Failed to delete item",
        err.response?.status || null
      );
    }
  };

  const renderManagedCards = () => {
    if (isComfortZoneStory) {
      const renderComfortListCard = (item, index, itemType) => {
        const startPress = (ev) => {
          pressTimerRef.current = setTimeout(() => {
            setContextMenu({
              visible: true,
              x: ev.clientX,
              y: ev.clientY,
              index,
              itemType,
            });
          }, 600);
        };

        const cancelPress = () => clearTimeout(pressTimerRef.current);

        return (
          <div
            key={`${itemType}-${item.id}`}
            onContextMenu={
              isReadOnlyView
                ? undefined
                : (ev) => {
                    ev.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: ev.clientX,
                      y: ev.clientY,
                      index,
                      itemType,
                    });
                  }
            }
            onMouseDown={isReadOnlyView ? undefined : startPress}
            onMouseUp={isReadOnlyView ? undefined : cancelPress}
            onMouseLeave={isReadOnlyView ? undefined : cancelPress}
            onTouchStart={isReadOnlyView ? undefined : startPress}
            onTouchEnd={isReadOnlyView ? undefined : cancelPress}
            className="relative rounded-2xl border border-white/10 hover:border-red-500/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(239,68,68,0.12)] bg-linear-to-br from-white/10 via-white/5 to-white/3 p-5"
          >
            <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
              {itemType === "movies" ? "Movie" : "Food"}
            </span>
            <p className="text-2xl mb-3">{itemType === "movies" ? "🎬" : "🍜"}</p>
            <h3 className="text-lg font-semibold tracking-wide">{item.name}</h3>
            <p className="text-gray-300/90 text-sm mt-2 leading-relaxed">{item.comment || "No note added"}</p>
          </div>
        );
      };

      const createAddCard = (itemType, label) => (
        <button
          key={`add-${itemType}`}
          onClick={() => {
            openAddModal(itemType);
          }}
          className="group rounded-2xl p-10 border border-dashed border-white/25 hover:border-red-500 bg-black/40 hover:bg-black/20 flex flex-col items-center justify-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(239,68,68,0.14)]"
        >
          <span className="text-4xl mb-4 text-red-400 group-hover:scale-110 transition">
            {itemType === "movies" ? "＋🎥" : "＋🍽️"}
          </span>
          <p className="text-gray-300 group-hover:text-white font-medium text-center">{label}</p>
          <p className="text-xs text-gray-500 mt-2">Right-click any card to edit or delete</p>
        </button>
      );

      return (
        <>
          <section className="md:col-span-3 rounded-3xl border border-white/10 bg-linear-to-b from-red-950/20 to-black/20 p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">Favorite Movies</h2>
              <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-200 border border-red-400/30">
                {comfortItems.movies.length} saved
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {!isReadOnlyView && createAddCard("movies", "Add Favorite Movie")}
              {comfortItems.movies.map((item, index) =>
                renderComfortListCard(item, index, "movies")
              )}
            </div>
            {!comfortItems.movies.length && (
              <p className="text-sm text-gray-400 mt-4">No movies yet. Add one to start your comfort library.</p>
            )}
          </section>

          <section className="md:col-span-3 mt-2 rounded-3xl border border-white/10 bg-linear-to-b from-orange-950/20 to-black/20 p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">Favorite Foods</h2>
              <span className="px-3 py-1 text-xs rounded-full bg-orange-500/20 text-orange-100 border border-orange-400/30">
                {comfortItems.foods.length} saved
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {!isReadOnlyView && createAddCard("foods", "Add Favorite Food")}
              {comfortItems.foods.map((item, index) =>
                renderComfortListCard(item, index, "foods")
              )}
            </div>
            {!comfortItems.foods.length && (
              <p className="text-sm text-gray-400 mt-4">No foods yet. Add a favorite dish and keep collecting.</p>
            )}
          </section>
        </>
      );
    }

    if (isPeopleStory) {
      return friends.map((friend, index) => {
        const startPress = (ev) => {
          pressTimerRef.current = setTimeout(() => {
            setContextMenu({ visible: true, x: ev.clientX, y: ev.clientY, index, itemType: null });
          }, 600);
        };

        const cancelPress = () => clearTimeout(pressTimerRef.current);

        return (
          <div
            key={index}
            onContextMenu={
              isReadOnlyView
                ? undefined
                : (ev) => {
                    ev.preventDefault();
                    setContextMenu({ visible: true, x: ev.clientX, y: ev.clientY, index, itemType: null });
                  }
            }
            onMouseDown={isReadOnlyView ? undefined : startPress}
            onMouseUp={isReadOnlyView ? undefined : cancelPress}
            onMouseLeave={isReadOnlyView ? undefined : cancelPress}
            onTouchStart={isReadOnlyView ? undefined : startPress}
            onTouchEnd={isReadOnlyView ? undefined : cancelPress}
            className="relative rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-red-600 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <img
              src={friend.photo || `https://ui-avatars.com/api/?name=${friend.name}&background=0b0b0d&color=fff`}
              alt={friend.name}
              className="w-full h-52 object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-0 p-4">
              <h3 className="text-lg font-semibold">{friend.name}</h3>
              <p className="text-gray-300 text-sm">{friend.descriptor}</p>
              <small className="text-gray-400">{friend.highlight}</small>
            </div>
          </div>
        );
      });
    }

    return items.map((item, index) => {
      const startPress = (ev) => {
        pressTimerRef.current = setTimeout(() => {
          setContextMenu({ visible: true, x: ev.clientX, y: ev.clientY, index, itemType: null });
        }, 600);
      };

      const cancelPress = () => clearTimeout(pressTimerRef.current);

      let title = "Item";
      let subtitle = "";
      let detail = "";

      if (selectedStory?.id === "creative-works") {
        title = item.project_name;
        subtitle = item.role || "Role not specified";
        detail = item.description || "No description";
      }

      if (selectedStory?.id === "school" || selectedStory?.id === "graduation") {
        title = item.school_name;
        subtitle = [item.degree, item.field].filter(Boolean).join(" | ");
        detail = [item.place, item.comment].filter(Boolean).join(" - ");
      }

      return (
        <div
          key={item.id || `${index}-${title}`}
          onContextMenu={
            isReadOnlyView
              ? undefined
              : (ev) => {
                  ev.preventDefault();
                  setContextMenu({ visible: true, x: ev.clientX, y: ev.clientY, index, itemType: null });
                }
          }
          onMouseDown={isReadOnlyView ? undefined : startPress}
          onMouseUp={isReadOnlyView ? undefined : cancelPress}
          onMouseLeave={isReadOnlyView ? undefined : cancelPress}
          onTouchStart={isReadOnlyView ? undefined : startPress}
          onTouchEnd={isReadOnlyView ? undefined : cancelPress}
          className="relative rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-red-600 transition hover:-translate-y-1 hover:shadow-2xl bg-white/5 p-5"
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-300 text-sm mt-1">{subtitle}</p>
          <small className="text-gray-400 block mt-2">{detail}</small>
        </div>
      );
    });
  };

  const renderModalBody = () => {
    if (isComfortZoneStory) {
      const label = comfortModalType === "foods" ? "Food" : "Movie";

      return (
        <>
          <input
            required
            placeholder={`${label} name`}
            className="p-2 bg-black border border-white/20 rounded"
            value={form.comfort_name}
            onChange={(e) => setForm((prev) => ({ ...prev, comfort_name: e.target.value }))}
          />
          <textarea
            placeholder="Comment"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.comfort_comment}
            onChange={(e) => setForm((prev) => ({ ...prev, comfort_comment: e.target.value }))}
          />
        </>
      );
    }

    if (selectedStory?.id === "creative-works") {
      return (
        <>
          <input
            required
            placeholder="Project name"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.project_name}
            onChange={(e) => setForm((prev) => ({ ...prev, project_name: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <input
            placeholder="Role"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          />
          <input
            type="date"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.joined_at}
            onChange={(e) => setForm((prev) => ({ ...prev, joined_at: e.target.value }))}
          />
        </>
      );
    }

    if (selectedStory?.id === "school" || selectedStory?.id === "graduation") {
      return (
        <>
          <input
            required
            placeholder="School name"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.school_name}
            onChange={(e) => setForm((prev) => ({ ...prev, school_name: e.target.value }))}
          />
          <input
            placeholder="Place"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.place}
            onChange={(e) => setForm((prev) => ({ ...prev, place: e.target.value }))}
          />
          <input
            placeholder="Degree"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.degree}
            onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))}
          />
          <input
            placeholder="Field"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.field}
            onChange={(e) => setForm((prev) => ({ ...prev, field: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Start year"
              className="p-2 bg-black border border-white/20 rounded"
              value={form.start_year}
              onChange={(e) => setForm((prev) => ({ ...prev, start_year: e.target.value }))}
            />
            <input
              type="number"
              placeholder="End year"
              className="p-2 bg-black border border-white/20 rounded"
              value={form.end_year}
              onChange={(e) => setForm((prev) => ({ ...prev, end_year: e.target.value }))}
            />
          </div>
          <textarea
            placeholder="Comment"
            className="p-2 bg-black border border-white/20 rounded"
            value={form.comment}
            onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
          />
        </>
      );
    }

    return (
      <>
        {!isEditing ? (
          <input
            placeholder="Enter Username"
            className="p-2 w-full bg-black border border-white/20 rounded mb-3"
            value={form.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
        ) : (
          <div className="p-2 w-full bg-black border border-white/20 rounded mb-3 text-gray-300">
            @{form.username}
          </div>
        )}

        {!isEditing && loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            Checking username...
          </div>
        )}

        {!isEditing && confirmUser && foundUser && (
          <div className="border border-white/10 p-3 rounded mb-4">
            <p className="text-sm text-gray-400 mb-2">User found. Is this them?</p>
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${foundUser.name}&background=0b0b0d&color=fff`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{foundUser.name}</p>
                <p className="text-xs text-gray-400">@{foundUser.username}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button onClick={confirmSelection} type="button" className="bg-red-600 px-3 py-1 rounded">
                Yes
              </button>

              <button
                onClick={() => setConfirmUser(false)}
                type="button"
                className="border border-white/20 px-3 py-1 rounded"
              >
                No
              </button>
            </div>
          </div>
        )}

        {isPeopleStory && (
          <>
            <input
              required
              placeholder="Name"
              className="p-2 bg-black border border-white/20 rounded"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              required
              placeholder="Descriptor"
              className="p-2 bg-black border border-white/20 rounded"
              value={form.descriptor}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptor: e.target.value }))}
            />
            <textarea
              required
              placeholder="Highlight"
              className="p-2 bg-black border border-white/20 rounded"
              value={form.highlight}
              onChange={(e) => setForm((prev) => ({ ...prev, highlight: e.target.value }))}
            />
            <input
              placeholder="Photo URL"
              className="p-2 bg-black border border-white/20 rounded"
              value={form.photo}
              onChange={(e) => setForm((prev) => ({ ...prev, photo: e.target.value }))}
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white bg-black overflow-hidden">
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-red-600/10 blur-[160px] rounded-full"></div>
      <div className="absolute top-[40%] -right-40 w-125 h-125 bg-red-500/10 blur-[160px] rounded-full"></div>

      <Navbar />

      <header className="pt-32 pb-20 text-center">
        <p className="uppercase tracking-widest text-gray-400">{selectedStory?.category || "Story"}</p>
        <h1
          className={`text-5xl font-bold px-6 py-2 inline-block rounded-lg ${
            isComfortZoneStory
              ? "bg-linear-to-r from-red-600 via-orange-500 to-amber-500"
              : "bg-red-600"
          }`}
        >
          {selectedStory?.title || "Story"}
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto px-4">
          {isComfortZoneStory
            ? "Curate your feel-good essentials. Save comfort movies and foods in one cozy space."
            : selectedStory?.summary || "Story not found."}
        </p>
      </header>

      <main className="flex-1 px-6">
        <div className={`${isComfortZoneStory ? "max-w-7xl" : "max-w-6xl"} mx-auto`}>
          {isManagedStory ? (
            <div className="grid md:grid-cols-3 gap-8">
              {!isReadOnlyView && !isComfortZoneStory && (
                <button
                  onClick={() => {
                    openAddModal();
                  }}
                  className="group border border-white/20 hover:border-red-600 rounded-xl p-12 flex flex-col items-center justify-center transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="text-5xl mb-3 text-red-500 group-hover:scale-110 transition">+</span>
                  <p className="text-gray-400 group-hover:text-white">Add {selectedStory?.title}</p>
                </button>
              )}
              {renderManagedCards()}
            </div>
          ) : (
            <section className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {selectedStory?.image && (
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-72 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">{selectedStory?.title || "Story"}</h2>
                <p className="text-gray-300 mb-4">{selectedStory?.summary || "No summary available."}</p>
                <p className="text-gray-400">{selectedStory?.detail || "No details available."}</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {contextMenu.visible && !isReadOnlyView && (
        <div
          className="fixed z-50 bg-[#0b0b0d] border border-white/10 rounded-lg shadow-lg"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              openEditModal(contextMenu.index, contextMenu.itemType);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="block px-4 py-2 hover:bg-white/10 w-full text-left"
          >
            Edit
          </button>
          <button
            onClick={() => {
              deleteEntry(contextMenu.index);
              setContextMenu((prev) => ({ ...prev, visible: false, itemType: null }));
            }}
            className="block px-4 py-2 hover:bg-red-600 w-full text-left"
          >
            Delete
          </button>
        </div>
      )}

      {openModal && !isReadOnlyView && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0d] border border-white/10 p-6 rounded-xl w-105 max-w-full">
            <h3 className="text-xl font-semibold mb-4">
              {isComfortZoneStory
                ? `${isEditing ? "Edit" : "Add"} Favorite ${comfortModalType === "foods" ? "Food" : "Movie"}`
                : `${isEditing ? "Edit" : "Add"} ${selectedStory?.title}`}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {renderModalBody()}
              <div className="flex gap-3 mt-3">
                <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                  {isEditing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    setComfortModalType(null);
                    setEditingItem(null);
                    resetModalState();
                  }}
                  className="border border-white/20 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        errorCode={errorModal.code}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <Footer />
    </div>
  );
}

export default StoryPage;
