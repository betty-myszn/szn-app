import { redirect } from "next/navigation";

// Community IS the chat rooms.
//
// There used to be a feed of posts here as well, with its own composer, sitting alongside a set of
// chat rooms that carried the same space names. "General chat" therefore meant two different pages,
// and a member who clicked Community landed on the feed while the conversation was happening in the
// room. That is what made an automated welcome look missing when it was posted correctly.
//
// So this URL now takes her straight into General Chat, the main community space, and the other
// rooms hang off that. Every existing link to /community keeps working and lands somewhere real.
//
// The old feed's posts, replies and likes were copied into the rooms they belonged to (as messages
// and 💜 reactions) before this landed. Nothing was deleted: community_posts, community_comments
// and community_likes still hold every original row, so this is reversible.
export default function CommunityPage() {
  redirect("/community/room/general");
}
