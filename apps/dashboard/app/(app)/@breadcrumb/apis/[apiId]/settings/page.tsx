import { BreadcrumbSkeleton } from "@/components/dashboard/breadcrumb-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getTenantId } from "@/lib/auth";
import { tags } from "@/lib/cache";
import { db } from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type PageProps = { params: { apiId: string } };

async function AsyncPageBreadcrumb(props: PageProps) {
  const tenantId = getTenantId();

  const getApiById = cache(
    async (apiId: string) =>
      db.query.apis.findFirst({
        where: (table, { eq, and, isNull }) => and(eq(table.id, apiId), isNull(table.deletedAt)),

        with: {
          workspace: true,
        },
      }),
    ["apiById"],
    { tags: [tags.api(props.params.apiId)] },
  );

  const api = await getApiById(props.params.apiId);
  if (!api || api.workspace.tenantId !== tenantId) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/apis">APIs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/apis/${props.params.apiId}`}>{api.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function PageBreadcrumb(props: PageProps) {
  return (
    <Suspense fallback={<BreadcrumbSkeleton levels={3} />}>
      <AsyncPageBreadcrumb {...props} />
    </Suspense>
  );
}
