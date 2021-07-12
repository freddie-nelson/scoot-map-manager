import { Octokit } from "@octokit/core";

const octokit = new Octokit({ auth: "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" });

const repo = "scoot-map-manager";
const user = "freddie-nelson";
const repoURL = `/repos/${user}/${repo}`;

export async function getNewestRelease() {
  try {
    const res = await octokit.request(`GET ${repoURL}/releases`);
    return res.data[0];
  } catch (e) {
    console.log(e);
    return false;
  }
}
