import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', {required: true})
    core.debug(`debug: token = ${token}`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const context = github.context;
    const contextStr = JSON.stringify(context, null, 2)
    core.debug(`debug: context = ${contextStr}`)

    core.setOutput('diff', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
