import * as core from '@actions/core'
import {IPRSpec, IPR, getPRDetails} from './pull_request'
import * as github from '@actions/github'
import { isNullOrUndefined } from 'util'

async function run(): Promise<void> {
  try {
    core.info(`info: START...`)
    const token = core.getInput('github-token', {required: true})

    const bodyDoesNotContain = core.getInput('bodyDoesNotContain', {required: false})
    core.info(`info: bodyDoesNotContain = ${bodyDoesNotContain}`)

    const context = github.context;
    const contextStr = JSON.stringify(context, null, 2)
    core.info(`info: context = ${contextStr}`)
    core.debug(`debug: context = ${contextStr}`)

    const contextPR = context.payload.pull_request
    if (!isNullOrUndefined(contextPR)) {
      const prSpec: IPRSpec = {
        token,
        owner: contextPR.base.repo.owner.login,
        repo: contextPR.base.repo.name,
        pull_number: contextPR.number,
      }
      core.info(`prSpec = ${JSON.stringify(prSpec, null, 2)}`)
      const prArr: IPR[] = await getPRDetails(prSpec)
      core.info(`res = ${JSON.stringify(prArr, null, 2)}`)
    } else {
      core.setFailed('This is not a Pull Request')
    }

    core.setOutput('diff', new Date().toTimeString()) // fay
    core.info(`info: END...`)
  } catch (error) {
    core.info(`info: error: ${error}`)
    core.setFailed(error.message)
  }
}

run()
