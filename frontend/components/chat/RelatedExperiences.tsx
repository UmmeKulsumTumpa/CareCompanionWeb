"use client";

import { RelatedExperience } from "@/types";
import { Collapse, Tag } from "antd";
import { BookOutlined } from "@ant-design/icons";

interface RelatedExperiencesProps {
    experiences: RelatedExperience[];
}

export default function RelatedExperiences({ experiences }: RelatedExperiencesProps) {
    if (!experiences || experiences.length === 0) return null;

    const items = experiences.map((exp, i) => ({
        key: String(i),
        label: (
            <div className="flex items-center gap-2">
                <BookOutlined className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{exp.source}</span>
                <Tag color="blue" className="text-xs">{Math.round(exp.similarity_score * 100)}% match</Tag>
            </div>
        ),
        children: (
            <div className="text-sm text-gray-600 leading-relaxed">
                <p>{exp.text}</p>
                {exp.url && (
                    <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-2 inline-block text-xs"
                    >
                        Read more at {exp.source} →
                    </a>
                )}
            </div>
        ),
    }));

    return (
        <div className="mt-3">
            <Collapse
                size="small"
                ghost
                items={items}
            />
        </div>
    );
}
