import { db } from "./client";
import { version1 } from "./schema";

export type RoadmapNode = {
  id: string;
  level: "phase" | "task" | "subtask" | "microtask";
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done";
  impact: "low" | "medium" | "high" | null;
  complexity: "low" | "medium" | "high" | null;
  category: string | null;
  children: RoadmapNode[];
};

export async function getRoadmapTree(): Promise<RoadmapNode[]> {
  const rows = await db.select().from(version1);

  const childrenByParent = new Map<string, typeof rows>();
  for (const row of rows) {
    const key = row.parentId ?? "root";
    const bucket = childrenByParent.get(key);
    if (bucket) bucket.push(row);
    else childrenByParent.set(key, [row]);
  }
  for (const bucket of childrenByParent.values()) {
    bucket.sort((a, b) => a.position - b.position);
  }

  function build(parentKey: string): RoadmapNode[] {
    const bucket = childrenByParent.get(parentKey) ?? [];
    return bucket.map((row) => ({
      id: row.id,
      level: row.level,
      title: row.title,
      description: row.description,
      status: row.status,
      impact: row.impact,
      complexity: row.complexity,
      category: row.category,
      children: build(row.id),
    }));
  }

  return build("root");
}
