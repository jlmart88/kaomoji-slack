import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative isolate pt-14">
      <div className="sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 pb-14 sm:pb-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex w-full flex-col items-center justify-center gap-6 p-4 text-center md:gap-10">
              <h1 className="text-4xl font-medium md:text-7xl">Kaomoji App</h1>
              <h2 className="whitespace-nowrap font-mono text-xl md:text-3xl">
                (╮°-°)╮┳━━┳ &nbsp;&nbsp;( ╯°□°)╯ ┻━━┻
              </h2>

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
            </div>
          </div>
        </div>

        <div
          id="learnmore"
          className="w-full bg-slate-700 px-8 py-20 text-center md:px-20"
        >
          <div className="mx-auto text-center md:max-w-xl">
            <h3 className="text-3xl font-medium">What is a Kaomoji?</h3>
            <p className="text-md mt-6">
              A Kaomoji is a Japanese style of emoji, often using a creative
              combination of Japanese characters and punctuation to create
              unique faces. Traditional English keyboards make these kaomoji
              hard to reproduce without resorting to copy-pasting, so this app
              makes it easy to find and send Kaomoji, without having to leave
              Slack.
            </p>
          </div>
        </div>

        <div className="w-full divide-y-2 divide-slate-200 bg-slate-50 text-left text-black">
          <div>
            <div className="mx-auto md:max-w-4xl">
              <div className="grid grid-cols-1 grid-rows-none items-center gap-x-8 gap-y-20 px-8 py-20 md:grid-cols-[3fr_5fr] md:px-8">
                <div className="">
                  <h3 className="text-3xl font-medium">
                    Send Kaomoji Effortlessly
                  </h3>
                  <p className="mt-6">
                    Simply type in a search that expresses how you&apos;re
                    feeling, and find one in the returned list that you like. No
                    need to copy-paste or type out complex characters; the
                    Kaomoji App will send the kaomoji for you.
                  </p>
                </div>
                <div>
                  <video
                    className="rounded border"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source
                      src="/images/kaomoji_example.webm"
                      type="video/webm"
                    />
                    <source
                      src="/images/kaomoji_example.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mx-auto md:max-w-4xl">
              <div className="grid grid-cols-1 grid-rows-none items-center gap-x-8 gap-y-20 px-8 py-20 md:grid-cols-[3fr_5fr] md:px-8">
                <div className="">
                  <h3 className="text-3xl font-medium">
                    Save Kaomoji For Easy Access
                  </h3>
                  <p className="mt-6">
                    Found a kaomoji that fits every situation? Rather than
                    searching for it everytime you want to use it, save it to
                    your shortcuts and pull it up quickly any time you need it.
                  </p>
                </div>
                <div>
                  <video
                    className="rounded border"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source
                      src="/images/kaomoji_shortcut_example.webm"
                      type="video/webm"
                    />
                    <source
                      src="/images/kaomoji_shortcut_example.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mx-auto max-w-2xl px-8 py-16 text-center">
              <h4 className="text-xl">
                Have further questions? Having trouble with Kaomoji App? Check
                out our{" "}
                <a className="text-blue-400 hover:text-blue-500" href="/faq">
                  FAQ
                </a>
                .
              </h4>
            </div>
          </div>
        </div>

        <footer className="">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-12 lg:px-8">
            <div className="mt-8 md:mt-0">
              <p className="text-center text-xs leading-5 text-gray-500">
                &copy; 2023 Justin Martinez. All rights reserved. &emsp;|&emsp;
                <a
                  className="text-gray-400 hover:text-gray-500"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
