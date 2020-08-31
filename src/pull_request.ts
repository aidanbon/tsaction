/*
 * pull_request.ts
 */
import * as github from '@actions/github'
const context = github.context;

export async function pull_request (token: string): Promise<boolean> {
  try {
    const octokit = github.getOctokit(token)
    const diffURL = 'https://api.github.com/repos/spin-org/data/pulls/272/commits'
    const diffResult = await octokit.request(diffURL);
    console.log(JSON.stringify(diffResult, null, 2))
    return true
  } catch (ex) {
    console.error(`Error in pull_request`, ex)
    return false
  }
}
