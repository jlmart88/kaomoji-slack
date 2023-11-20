import clientPromise from "@/lib/mongodb";
import Shortcut, { ShortcutModel } from "./index";
import _ from "lodash";

export const MAX_SHORTCUTS_PER_USER = 100;

export async function createShortcut(userId: string, kaomojiText?: string) {
  await clientPromise;
  return Shortcut.create({ user_id: userId, kaomoji_text: kaomojiText });
}

export async function deleteShortcut(id?: string) {
  await clientPromise;
  return Shortcut.deleteOne({ _id: id }).exec();
}

// given an userId, will return all of the shortcuts set by that user, or null if there are no shortcuts set
export async function getShortcutsForUser(userId: string) {
  await clientPromise;
  const shortcuts = await Shortcut.collection
    .find<ShortcutModel>({ user_id: userId })
    .toArray();
  if (_.isEmpty(shortcuts)) return null;
  return shortcuts;
}

export const hasUserExceededShortcutLimit = async (userId: string) => {
  await clientPromise;
  const count = await Shortcut.collection.countDocuments({ user_id: userId });
  return count >= MAX_SHORTCUTS_PER_USER;
};
