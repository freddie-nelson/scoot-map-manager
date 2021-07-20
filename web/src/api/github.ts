import { Octokit } from "@octokit/core";

const octokit = new Octokit();

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
