import * as core from '@actions/core'
import * as github from '@actions/github'
const parse = require('parse-diff')

async function run(): Promise<void> {
  try {
    core.info(`info: START...`)
    const token = core.getInput('github-token', {required: true})
    core.info(`info: token = ${token}`)
    core.debug(`debug: token = ${token}`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    const bodyDoesNotContain = core.getInput('bodyDoesNotContain', {required: false})
    core.info(`info: bodyDoesNotContain = ${bodyDoesNotContain}`)

    const context = github.context;
    const contextStr = JSON.stringify(context, null, 2)
    core.info(`info: context = ${contextStr}`)
    core.debug(`debug: context = ${contextStr}`)

    const octokit = github.getOctokit(token)
    const diffURL = context?.payload?.pull_request?.diff_url || ''
    // const commitsURL = context?.payload?.pull_request?.commits_url || ''
    core.info(`info: octokit request to URL: ${diffURL}`)
    const diffResult = await octokit.request(diffURL);
    core.info(`info: request result = ${JSON.stringify(diffResult, null, 2)}`);
    if (diffResult && diffResult.data) {
      const diffFiles = parse(diffResult.data)
      const diffFilesStr = JSON.stringify(diffFiles, null, 2)
      core.info(`debug: diffFiles = ${diffFilesStr}`)
    }

    core.setOutput('diff', new Date().toTimeString())
    core.info(`info: END...`)
  } catch (error) {
    core.info(`info: error: ${error}`)
    core.setFailed(error.message)
  }
}

run()
