import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";

export default function Success() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex w-full flex-grow flex-col justify-center bg-slate-50 px-8 py-20 text-center text-black md:px-20">
        <div className="mx-auto md:max-w-xl">
          <h3 className="text-3xl font-medium">Kaomoji App has been added!</h3>
          <p className="text-md mt-6">
            Type <b>/kaomoji</b> in Slack to begin using the Kaomoji App.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
