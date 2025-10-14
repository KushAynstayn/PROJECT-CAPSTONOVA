import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tag, Code, User, Calendar } from "lucide-react";

export interface RelatedStudy {
  id: number;
  title: string;
  submission_year: string;
  adviser: string | null;
  abstract_snippet: string;
  keyword_tags: string[];
  language_tags: string[];
}

const RelatedStudyCard: React.FC<{ study: RelatedStudy }> = ({ study }) => {
  return (
    <div className="bg-stone-800/60 p-5 rounded-lg border border-stone-700/50 hover:border-yellow-500/50 transition-all duration-300 flex-shrink-0 w-[350px] h-[280px] flex flex-col">
      <div className="flex-grow">
        <Link href={`/abstract/${study.id}`} passHref>
          <h3 className="text-lg font-bold text-yellow-400 hover:text-yellow-300 mb-2 line-clamp-2 cursor-pointer">
            {study.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-4 flex-wrap">
          {study.adviser && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{study.adviser}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{study.submission_year}</span>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3 text-sm">
          {study.abstract_snippet}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        {study.keyword_tags.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-1.5">
              {study.keyword_tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-700 text-gray-200 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {study.language_tags.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-1.5">
              {study.language_tags.slice(0, 3).map((tag) => (
                <Badge key={tag} className="bg-blue-800 text-blue-200 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedStudyCard;
