import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="divide-y-2 divide-slate-200">
        <div className="flex w-full flex-grow flex-col justify-center bg-slate-50 px-8 py-20 text-center text-black md:px-20">
          <div className="mx-auto md:max-w-xl">
            <h3 className="text-3xl font-medium">Privacy Policy</h3>
            <p className="text-md mt-6">
              Kaomoji App only receives and stores the name of your Slack team
              and an anonymous identification token, which is used to connect
              you to your saved shortcuts. In order to improve the user
              experience, Kaomoji App also requests permission to post messages
              as you. Kaomoji App will never post as you without a clear
              indication that you wish to send a message, and you will always
              see the kaomoji that is about to be posted.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-grow flex-col justify-center bg-slate-50 px-8 py-20 text-center text-black md:px-20">
          <div className="mx-auto md:max-w-xl">
            <h3 className="text-3xl font-medium">Contact</h3>
            <p className="text-md mt-6 text-left">
              <p>
                Kaomoji App is an{" "}
                <a
                  className="text-blue-600 hover:text-blue-500"
                  href="https://github.com/jlmart88/kaomoji-slack"
                >
                  open source project
                </a>
                . <br />
                <br />
                If you have any questions/concerns/suggestions, please{" "}
                <a
                  className="text-blue-600 hover:text-blue-500"
                  href="https://github.com/jlmart88/kaomoji-slack/issues"
                >
                  submit an issue
                </a>
                , or{" "}
                <a
                  className="text-blue-600 hover:text-blue-500"
                  href="mailto:kaomoji.slack.team@gmail.com"
                >
                  email
                </a>{" "}
                the Kaomoji App team.
              </p>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
