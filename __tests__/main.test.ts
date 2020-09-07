import {wait} from '../src/wait'
import {IPRSpec, IPR, getPRDetails} from '../src/pull_request'
import { isNullOrUndefined } from 'util'
// import * as process from 'process'
// import * as cp from 'child_process'
// import * as path from 'path'

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

// test('wait 500 ms', async () => {
//   const start = new Date()
//   await wait(500)
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })

// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500'
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecSyncOptions = {
//     env: process.env
//   }
//   // console.log(cp.execSync(`node ${ip}`, options).toString())
//   console.log('skipped')
// })

test ('isNullOrUndefined', () => {
  let xx: string = 'xx'
  if (!isNullOrUndefined(xx)) {
    console.log('yes, xx is defined')
  }
})

test('getPRDetails', async () => {
  // To generate a Personal Access Token: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
  const prSpec: IPRSpec = {
    token: `phc github`,
    owner: 'spin-org',
    repo: 'data',
    pull_number: 272,
  }
  const prArr: IPR[] = await getPRDetails(prSpec)
  console.log(`res = ${JSON.stringify(prArr, null, 2)}`)
})
