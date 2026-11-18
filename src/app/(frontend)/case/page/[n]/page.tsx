import { CptArchive } from '@/lib/archives'

export const revalidate = 3600

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params
  return <CptArchive collection="cases" title="Case studies" rest={['page', n]} />
}
