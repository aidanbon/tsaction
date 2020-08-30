import * as core from '@actions/core'
import * as github from '@actions/github'

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

    core.setOutput('diff', new Date().toTimeString())
    core.info(`info: END...`)
  } catch (error) {
    core.info(`info: error: ${error.message}`)
    core.setFailed(error.message)
  }
}

run()
