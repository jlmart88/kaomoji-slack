"use client";

import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import KaomojiUnauthorized from "../../public/images/kaomoji_unauthorized.png";
import AddToSlack from "../../public/images/btn-add-to-slack.svg";

export default function FAQ() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              <Disclosure as="div" className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="mb-7 flex w-full flex-col gap-7 text-left text-gray-900">
                        <div className="flex w-full items-start justify-between">
                          <span className="text-base font-semibold leading-7">
                            {
                              'Getting "not authorized" error when adding Kaomoji App:'
                            }
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </div>
                        <div className="self-center">
                          <Image
                            alt="Unauthorized Error"
                            src={KaomojiUnauthorized}
                            width={400}
                          />
                        </div>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel
                      as="dd"
                      className="mb-7 mt-2 pr-12 text-gray-700"
                    >
                      <p className="mt-7">
                        {
                          'Kaomoji App requires that each user in a team to individually "add" it for it to work properly for that user. If your team only allows admins to add Slack Apps, then an admin must perform the following steps to allow you to add Kaomoji App.'
                        }
                      </p>

                      <p className="mt-7">
                        {
                          "1. Have your admin (let's call her Melissa) add Kaomoji App to your team, using the button below:"
                        }
                      </p>

                      <div className="mt-7 flex w-full justify-center">
                        <Link href="/oauth/signin" target="_blank">
                          <Image alt="Add to Slack" src={AddToSlack} />
                        </Link>
                      </div>

                      <p className="mt-7">
                        2. Then, have Melissa navigate to your team&apos;s{" "}
                        <Link
                          className="text-blue-500 hover:text-blue-400"
                          href="https://slack.com/apps/manage"
                        >
                          App Management
                        </Link>{" "}
                        page, and click the <b>Approve</b> button for Kaomoji
                        App, to move it from the <b>Restricted Apps</b> section
                        to the <b>Approved Apps</b> section:
                      </p>

                      <div className="mt-7 flex w-full justify-center">
                        <video width={400} autoPlay loop muted playsInline>
                          <source
                            src="/images/kaomoji_manage_apps.webm"
                            type="video/webm"
                          />
                          <source
                            src="/images/kaomoji_manage_apps.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </div>

                      <p className="mt-7">
                        3. Finally, approve Kaomoji App again for yourself (you
                        can use the Add to Slack button for yourself as well):
                      </p>

                      <div className="mt-7 flex w-full justify-center">
                        <Link href="/oauth/signin" target="_blank">
                          <Image alt="Add to Slack" src={AddToSlack} />
                        </Link>
                      </div>

                      <p className="mt-7">
                        Done! <span className="font-mono">＼(^o^)／</span>
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </dl>
            <div className="pt-10 text-black">
              <p>
                If you have further questions that were not answered above,
                please{" "}
                <Link
                  className="text-blue-500 hover:text-blue-400"
                  href="https://github.com/jlmart88/kaomoji-slack/issues"
                >
                  submit an issue
                </Link>
                , or{" "}
                <Link
                  className="text-blue-500 hover:text-blue-400"
                  href="mailto:kaomoji.slack.team@gmail.com"
                >
                  email
                </Link>{" "}
                the Kaomoji App team.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
