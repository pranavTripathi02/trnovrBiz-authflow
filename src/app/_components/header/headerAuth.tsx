import getUserSession from "@/lib/getUserSession";

async function HeaderAuth() {
  const userSession = await getUserSession();
  if (!userSession?.user) return null;
  return (
    <div className="flex justify-end space-x-4 px-8 pt-2 text-xs text-neutral-500">
      <button>Help</button>
      <button>Orders & Returns</button>
      <button title="Logout">Hi, {userSession.user.name}</button>
    </div>
  );
}

export default HeaderAuth;
