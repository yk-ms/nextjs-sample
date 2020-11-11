import fetch from 'node-fetch'

function Rails({ name, stars }) {
  return <div>{name} stars: {stars}</div>
}

// 最初に実行される。事前ビルドするパスを配列でreturnする。
export async function getStaticPaths() {
  // zeitが管理するレポジトリを(APIのデフォルトである)30件取得する
  const res = await fetch('https://api.github.com/orgs/rails/repos')
  const repos = await res.json()
  // レポジトリの名前をパスとする
  const paths = repos.map(repo => `/rails/${repo.name}`)
  // 事前ビルドしたいパスをpathsとして渡す fallbackについては後述
  return { paths, fallback: false }
}

// ルーティングの情報が入ったparamsを受け取る
export async function getStaticProps({ params }) {
  // ファイル名のzeit/[name].jsに対応
  const name = params.name
  const res = await fetch(`https://api.github.com/repos/rails/${name}`)
  const json = await res.json()
  const stars = json.stargazers_count

  return { props: { name, stars } }
}

export default Rails