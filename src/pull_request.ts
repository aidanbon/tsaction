/*
 * pull_request.ts
 */
import * as github from '@actions/github'
const parseFilePatch = require('git-file-patch-parser');

interface IPRSpec {
  token: string,
  owner: string,
  repo: string,
  pull_number: number,
}

interface IPatchItem {
  modification: 'added' | 'deleted',
  line: string,
  lineNumber: number,
}

interface IPR {
  filename: string,
  status: 'added' | 'removed' | 'modified',
  patchItemArr?: IPatchItem[],
  fullFileBody?: string,
}

const getPRDetails = async ({token, owner, repo, pull_number}: IPRSpec): Promise<IPR[]> => {
  try {
    const octokit = github.getOctokit(token)
    const {data: fileList} = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number,
    })

    // asyncFunc when invoked with a listFiles() item, it will return the IPR object
    const asyncFunc = async (file: any): Promise<IPR> => {
      const pr: IPR = {
        filename: file.filename,
        status: file.status,
      }
      if (file.status === 'removed') {
        // if the file is removed, then don't further need patchItemArr nor fullFileBody
        return pr
      }
      if (file.patch) {
        pr.patchItemArr = parseFilePatch(file.patch)
      }
      if (file.status === 'added') {
        // if the file is newly added, then don't further need fullFileBody because it'll be same as patchItemArr
        return pr
      }
      const blob = await octokit.git.getBlob({
        owner,
        repo,
        file_sha: file.sha,
      })
      if (blob.status === 200) {
        const buff = new Buffer(blob.data.content, 'base64');
        const clearText = buff.toString('ascii');
        pr.fullFileBody = clearText
      }
      return pr
    } // asyncFunc
    const asyncFuncArr = fileList.map(file => asyncFunc(file))
    return Promise.all(asyncFuncArr)
  }  catch (ex) {
    console.error(`Error in getPRDetails`, ex)
    throw ex
  }
} // getPRDetails

export {
  IPRSpec,
  IPR,
  getPRDetails,
}

/*
const getPRDetails_old = async ({token, owner, repo, pull_number}: IPRSpec): Promise<boolean> => {
  try {
    const octokit = github.getOctokit(token)
    // const diffURL = 'https://api.github.com/repos/spin-org/data/pulls/272/commits'
    // const diffResult = await octokit.request(diffURL);
    // console.log(JSON.stringify(diffResult, null, 2))

    const { data: diff } = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
      mediaType: {
        format: "diff",
      },
    });
    console.log(`diff data: `, diff)
    const files = parse(diff);
    console.log('files length =', files.length); // number of patched files
    files.forEach(function(file: { chunks: string | any[]; deletions: any; additions: any; }) {
      console.log('\n------\n', JSON.stringify(file, null, 2))
      // console.log(file.chunks.length); // number of hunks
      // console.log(file.chunks[0].changes.length) // hunk added/deleted/context lines
      // // each item in changes is a string
      // console.log(file.deletions); // number of deletions in the patch
      // console.log(file.additions); // number of additions in the patch
    });

    // ----------
    // const { data: pr} = await octokit.pulls.get({
    //   owner,
    //   repo,
    //   pull_number,
    // });
    // console.log(`\n\n------\nPR data: `, pr) 

    // ----------
    const { data: fileList} = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    // console.log(`\n\n------\nList files: `, fileList)  
    fileList.forEach(file => {
      console.log(`\n`)
      console.log(`filename: ${file.filename}`)
      console.log(`sha: ${file.sha}`)
      console.log(`status: ${file.status}`)
      console.log('patch:\n', parseFilePatch(file.patch));
    });

    // ----------- 
    const file_sha = '358a8601523d20e0ea61e6a27feafb7d04f61856' // obtained from listFiles()
    const blob = await octokit.git.getBlob({
      owner,
      repo,
      file_sha,
    });
    console.log('\n\n------ blobs ------\n')
    // console.log(JSON.stringify(blob, null, 2))
    if (blob.status === 200) {
      // console.log(`encoded: `, blob.data.content)
      const buff = new Buffer(blob.data.content, 'base64');
      const clearText = buff.toString('ascii');
      console.log(`Body:\n`)
      console.log(clearText)
    } else {
      console.log(`error:`)
      console.log(JSON.stringify(blob, null, 2))
    }

    return true
  } catch (ex) {
    console.error(`Error in getPRDetails`, ex)
    return false
  }
}  // getPRDetails_old
*/
