import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate pt-14">
      <div className="sm:pt-32">
        <HeroSection withButtons />

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
                <Link className="text-blue-400 hover:text-blue-500" href="/faq">
                  FAQ
                </Link>
                .
              </h4>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
