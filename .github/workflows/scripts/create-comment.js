const MESSAGE_ID = (id) => `<!-- add-pr-comment:${id}:add-pr-comment -->`;
module.exports = async ({ github, context, body, id }) => {
  const parameters = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    per_page: 100,
  };

  let found;
  for await (const comments of github.paginate.iterator(
    github.rest.issues.listComments,
    parameters
  )) {
    found = comments.data.find(({ body }) => {
      return (body?.search(MESSAGE_ID(id)) ?? -1) > -1;
    });

    if (found) {
      break;
    }
  }

  if (found) {
    await github.rest.issues.deleteComment({
      comment_id: found.id,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: found.body,
    });
  }

  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: `${MESSAGE_ID(id)}\n\n${body}`,
  });
};
