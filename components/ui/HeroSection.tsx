import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export const HeroSection = ({
  withButtons = false,
}: {
  withButtons?: boolean;
}) => {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-14 sm:pb-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex w-full flex-col items-center justify-center gap-6 p-4 text-center md:gap-10">
          <h1 className="text-4xl font-medium md:text-7xl">Kaomoji App</h1>
          <h2 className="whitespace-nowrap font-mono text-xl md:text-3xl">
            (╮°-°)╮┳━━┳ &nbsp;&nbsp;( ╯°□°)╯ ┻━━┻
          </h2>

          {withButtons && (
            <>
              <div className="mt-4 flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-6">
                <a
                  className="rounded-lg shadow-sm hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  href="/oauth/signin"
                  target="_blank"
                >
                  <Image
                    alt="Add to Slack"
                    width={191}
                    height={56}
                    src="/images/btn-add-to-slack.svg"
                  />
                </a>
                <a
                  className="rounded-lg border border-sky-600 bg-sky-500 p-3 text-xl leading-8 shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  href="#learnmore"
                >
                  <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                    <span className="pl-1">Learn More</span>
                    <ChevronRightIcon width={25} height={25} />
                  </div>
                </a>
              </div>
              <a
                className="rounded-lg border border-neutral-400 bg-neutral-300 p-3 text-neutral-800 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href="https://github.com/jlmart88/kaomoji-slack"
              >
                <div className="flex flex-row items-center gap-2">
                  <Image
                    alt="GitHub Icon"
                    width={19}
                    height={19}
                    src="/images/github-mark.svg"
                  />
                  <span className="text-sm tracking-tight">
                    View on <span className="font-semibold">GitHub</span>
                  </span>
                </div>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
