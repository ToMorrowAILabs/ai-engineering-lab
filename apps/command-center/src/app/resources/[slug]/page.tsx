import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ActionBadge,
  PdfBadge,
  SourceTypeBadge,
} from "@/components/resources/ResourceBadges";
import { ExternalLink, InternalLink, OpenResourceButton } from "@/components/navigation/NavLinks";
import {
  getAllResources,
  getRelatedLessonSlug,
  getResourceBySlug,
  isSafeUrl,
} from "@/lib/catalog";
import { CATEGORY_LABELS } from "@/lib/types";

export function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.id }));
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource || !isSafeUrl(resource.url)) notFound();

  const relatedLesson = getRelatedLessonSlug(resource.id);

  return (
    <div>
      <PageHeader
        title={resource.title}
        subtitle={`${CATEGORY_LABELS[resource.category]} · ${resource.learning_phase}`}
      />

      <div className="mb-4">
        <InternalLink href="/resources" className="text-sm">
          ← All resources
        </InternalLink>
      </div>

      <div className="glass-panel p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SourceTypeBadge type={resource.source_type} />
          <ActionBadge action={resource.action} />
          {resource.pdfAvailable && <PdfBadge />}
          {resource.commute_friendly && <span className="badge-monitor">commute friendly</span>}
          {resource.project_candidate && <span className="badge-ready">project candidate</span>}
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-gray-500">Category</dt>
            <dd className="mt-1">{CATEGORY_LABELS[resource.category]}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-500">Phase</dt>
            <dd className="mt-1">{resource.learning_phase}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-500">Priority</dt>
            <dd className="mt-1 capitalize">{resource.priority}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-500">Action</dt>
            <dd className="mt-1 capitalize">{resource.action.replace(/_/g, " ")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-500">Relevance score</dt>
            <dd className="mt-1 font-mono text-cyan-400">{resource.relevance_score}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-500">Commute friendly</dt>
            <dd className="mt-1">{resource.commute_friendly ? "Yes" : "No"}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <dt className="text-xs uppercase text-gray-500">Recommended use</dt>
          <dd className="mt-1 text-sm text-gray-300">{resource.recommended_use}</dd>
        </div>

        {resource.notes && (
          <div className="mt-4">
            <dt className="text-xs uppercase text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-400">{resource.notes}</dd>
          </div>
        )}

        {relatedLesson && (
          <div className="mt-4">
            <dt className="text-xs uppercase text-gray-500">Related lesson</dt>
            <dd className="mt-1">
              <InternalLink href={`/lessons/${relatedLesson}`}>{relatedLesson.replace("-", " ")}</InternalLink>
            </dd>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <OpenResourceButton href={resource.url} />
          <ExternalLink href={resource.url} className="text-sm">
            {resource.url.replace(/^https?:\/\//, "")}
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
