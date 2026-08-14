import { notFound, permanentRedirect } from "next/navigation";
import ArticleListing from "../../ArticleListing";

export async function generateMetadata() {
  return { title: "مقالات ریگورا" };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const category = params.slug?.[0];
  if ((params.slug?.length ?? 0) > 1) notFound();
  const requestedPage = Number(searchParams.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  if (!category) {
    permanentRedirect(page > 1 ? `/blog?page=${page}` : "/blog");
  }
  return <ArticleListing category={category} page={page} />;
}
