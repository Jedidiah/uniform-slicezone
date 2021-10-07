import { IntentTagVector, IntentVector } from "@uniformdev/optimize-common";
import fetch from "node-fetch";

export async function fetchIntents(apiKey: string, projectId: string) {
  if (!apiKey || !projectId) {
    console.error(
      "You need to pass an api key and a project id for Uniform. Make sure that your enviroment variables are set correctly."
    );
    return { statusCode: 400, body: "Missing Project ID or API Key" };
  }

  try {
    const res = await fetch(
      `https://uniform.app/api/v1/manifest?projectId=${projectId}`,
      { method: "post", headers: { "x-api-key": apiKey } }
    );

    const data = (await res.json()) as { site: { intents: IntentVector[] } };

    const results = mapIntents(data.site.intents);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        results_size: results.length,
        results,
      }),
    };
  } catch (error) {
    console.error("Error fetching Uniform intents", error);
    return { statusCode: 500, body: String(error) };
  }
}

/**
 * This function maps over the intents coming from the Uniform API
 * and turns them into a format Prismic will be happy with.
 * @param intents
 */
function mapIntents(intents: IntentTagVector[]) {
  return intents.map((intent) => {
    const id = String(intent.id);
    return {
      id,
      title: `${id}`,
      description: `This content is visible for users with the intent ${intent.id}`,
      image_url:
        "https://pbs.twimg.com/profile_images/1235674864649830400/kd3pN6iU_400x400.jpg",
      last_update: Date.now(),
      blob: { [id]: intent },
    };
  });
}
