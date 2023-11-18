import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative isolate pt-14">
      <div className="pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="w-full p-4 flex flex-col gap-6 items-center text-center justify-center">
              <h1 className="text-4xl font-bold">Kaomoji App</h1>
              <h2 className="text-2xl font-mono">
                (╮°-°)╮┳━━┳ &nbsp;&nbsp;( ╯°□°)╯ ┻━━┻
              </h2>

              <div className="mt-4 flex flex-row items-center gap-4">
                <a
                  className="rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  href="/oauth/signin"
                  target="_blank"
                >
                  <Image
                    alt="Add to Slack"
                    width={140}
                    height={41}
                    src="/images/btn-add-to-slack.svg"
                  />
                </a>
                <a
                  className="p-2.5 rounded-md bg-sky-500 shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  href="#learnmore"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="pl-1 text-sm">Learn More</span>
                    <ChevronRightIcon width={20} height={20} />
                  </div>
                </a>
              </div>
              <a
                className="p-2.5 rounded-md bg-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href="https://github.com/jlmart88/kaomoji-slack"
              >
                <div className="flex flex-row items-center gap-2">
                  <Image
                    alt="GitHub Icon"
                    width={19}
                    height={19}
                    src="/images/github-mark.svg"
                  />
                  <span className="text-sm tracking-tight text-black">
                    View on <span className="font-semibold">GitHub</span>
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div
            id="learnmore"
            className="bg-slate-700 rounded-lg mt-8 mx-auto p-8 max-w-2xl text-center"
          >
            <h3 className="text-3xl font-semibold">What is a Kaomoji?</h3>
            <p className="mt-6 text-left">
              A Kaomoji is a Japanese style of emoji, often using a creative
              combination of Japanese characters and punctuation to create
              unique faces. Traditional English keyboards make these kaomoji
              hard to reproduce without resorting to copy-pasting, so this app
              makes it easy to find and send Kaomoji, without having to leave
              Slack.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg mx-auto mt-8 max-w-2xl p-12 text-center md:mt-16 md:max-w-4xl">
            <div className="grid grid-cols-1 grid-rows-none gap-y-6 gap-x-8 items-center md:grid-cols-[3fr_5fr] md:grid-rows-2 md:gap-y-10">
              <div className="">
                <h3 className="text-2xl font-semibold">
                  Send Kaomoji Effortlessly
                </h3>
                <p className="mt-6 text-left">
                  Simply type in a search that expresses how you&apos;re
                  feeling, and find one in the returned list that you like. No
                  need to copy-paste or type out complex characters; the Kaomoji
                  App will send the kaomoji for you.
                </p>
              </div>
              <div>
                <video className="border" autoPlay loop muted playsInline>
                  <source
                    src="/images/kaomoji_example.webm"
                    type="video/webm"
                  />
                  <source src="/images/kaomoji_example.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="">
                <h3 className="text-2xl font-semibold">
                  Save Kaomoji For Easy Access
                </h3>
                <p className="mt-6 text-left">
                  Found a kaomoji that fits every situation? Rather than
                  searching for it everytime you want to use it, save it to your
                  shortcuts and pull it up quickly any time you need it.
                </p>
              </div>
              <div>
                <video className="border" autoPlay loop muted playsInline>
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

          <div className="mt-16 text-center">
            <h4 className="text-xl">
              Have further questions? Having trouble with Kaomoji App? Check out
              our{" "}
              <a className="text-blue-400 hover:text-blue-500" href="/faq">
                FAQ
              </a>
              .
            </h4>
          </div>

          <footer className="">
            <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col items-center lg:px-8">
              <div className="mt-8 md:mt-0">
                <p className="text-center text-xs leading-5 text-gray-500">
                  &copy; 2023 Justin Martinez. All rights reserved.{" "}
                </p>
                <p className="text-center text-xs leading-5 text-gray-500">
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
    </div>
  );
}
