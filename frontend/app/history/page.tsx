// History is now displayed in the chat sidebar.
// Redirect users to /chat where they can see their conversation history.
import { redirect } from "next/navigation";

export default function HistoryPage() {
    redirect("/chat");
}
