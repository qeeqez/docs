export interface GithubProps {
  /**
   * GitHub Repository owner name.
   */
  owner: string;

  /**
   * GitHub Repository repo name.
   */
  repo: string;

  /**
   * SHA or ref (branch or tag) name.
   *
   * @defaultValue main
   */
  sha?: string;

  /**
   * File path in the repo
   *
   * @example "content/docs/getting-started.mdx"
   */
  path: string;
}
