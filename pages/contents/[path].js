import * as Contentful from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const client = Contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
});

function Content({ fields }) {
  return (
    <div>
      <p>
        {fields.title}
      </p>
      <p>
        {documentToHtmlString(fields.body)}
      </p>
    </div>
  )
}

// 最初に実行される。事前ビルドするパスを配列でreturnする。
export async function getStaticPaths() {
  const entries = await client.getEntries();
  // レポジトリの名前をパスとする
  const paths = entries.items.map(item => `/contents/${item.fields.path}`)
  // 事前ビルドしたいパスをpathsとして渡す fallbackについては後述
  return { paths, fallback: false }
}

// ルーティングの情報が入ったparamsを受け取る
export async function getStaticProps({ params }) {
  // ファイル名のcontents/[path].jsに対応
  const path = params.path
  const entries = await client.getEntries({
    "content_type": "title",
    'fields.path': path,
  });

  return { props: { fields: entries.items[0].fields } }
}

export default Content