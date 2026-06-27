// 服务端组件：提供 generateStaticParams 用于静态导出
// 实际渲染委托给 EditPostClient（客户端组件）
import EditPostClient from './EditPostClient'

export async function generateStaticParams() {
  return [{ slug: '_placeholder' }]
}

export default function EditPostPage({
  params,
}: {
  params: { slug: string }
}) {
  return <EditPostClient slug={params.slug} />
}
