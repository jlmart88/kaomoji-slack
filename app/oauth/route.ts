import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config";
import UserTokenModel from "@/models/oauth/userToken";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!code) {
    console.log("Looks like we're not getting a code.");
    return NextResponse.redirect("/");
  }

  // If it's there...

  // We'll do a GET call to Slack's `oauth.v2.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
  const data = new FormData();
  data.append("code", code);
  data.append("client_id", config.SLACK_CLIENT_ID);
  data.append("client_secret", config.SLACK_CLIENT_SECRET);
  try {
    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      body: data,
      method: "POST",
      cache: "no-cache",
    });
    const body = await response.json();
    console.log("body", body);
    let token = body.authed_user;
    if (token) {
      let query = { user_id: token.id };
      // Upsert this new token
      await clientPromise;
      await UserTokenModel.findOneAndUpdate(query, token, {
        upsert: true,
        new: true,
      }).exec();
      return NextResponse.redirect("/success");
    } else {
      throw new Error(`Failed to get a token id: ${JSON.stringify(body)}`);
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ Error: err }, { status: 500 });
  }
}
