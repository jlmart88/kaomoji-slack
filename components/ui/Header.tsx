import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4 text-center">
      <Link href="/">
        <h1 className="text-3xl font-medium">Kaomoji App</h1>
      </Link>
      <h2 className="whitespace-nowrap font-mono text-lg">
        (╮°-°)╮┳━━┳ &nbsp;&nbsp;( ╯°□°)╯ ┻━━┻
      </h2>
    </div>
  );
};
