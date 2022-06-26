const { Octokit } = require("@octokit/core");

const getCiBuildId = async () => {
    const {
        GITHUB_WORKFLOW,
        GITHUB_SHA,
        GITHUB_TOKEN,
        GITHUB_RUN_ID,
        GITHUB_REPOSITORY
    } = process.env;

    const [owner, repo] = GITHUB_REPOSITORY.split("/");
    // let branch;
    let parallelId = `${GITHUB_WORKFLOW} - ${GITHUB_SHA}`;

    if (GITHUB_TOKEN) {
        // console.log(`Determining build id by asking GitHub about run ${GITHUB_RUN_ID}`);

        const client = new Octokit({
            auth: GITHUB_TOKEN
        });

        // const resp = await client.request(
        //     "GET /repos/:owner/:repo/actions/runs/:run_id",
        //     {
        //         owner,
        //         repo,
        //         // eslint-disable-next-line radix
        //         run_id: parseInt(GITHUB_RUN_ID)
        //     }
        // );

        // if (resp && resp.data && resp.data.head_branch) {
        //     branch = resp.data.head_branch;
        //     console.log(`found the branch name ${branch}`);
        // }

        // This will return the complete list of jobs for a run with their steps,
        // this should always return data when there are jobs on the workflow.
        // Every time the workflow is re-run the jobs length should stay the same
        // (because the same amount of jobs were ran) but the id of them should change
        // letting us, select the first id as unique id
        // https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run
        const runsList = await client.request(
            "GET /repos/:owner/:repo/actions/runs/:run_id/jobs",
            {
                owner,
                repo,
                // eslint-disable-next-line radix
                run_id: parseInt(GITHUB_RUN_ID)
            }
        );

        if (
            runsList &&
            runsList.data &&
            runsList.data.jobs &&
            runsList.data.jobs.length
        ) {
            const jobId = runsList.data.jobs[0].id;
            // console.log(`fetched run list with jobId ${jobId}`);
            parallelId = `${GITHUB_RUN_ID}-${jobId}`;
        } else {
            // console.log("could not get run list data");
        }
    }

    // console.log(`determined branch ${branch} and parallel id ${parallelId}`);
    // return { branch, parallelId };
    console.log(parallelId);
};

getCiBuildId();