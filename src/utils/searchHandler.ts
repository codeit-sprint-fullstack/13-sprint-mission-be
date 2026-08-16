import prisma, { Prisma } from "../lib/prisma";

interface SearchByKeywordParams {
  table: string;
  fields: string[];
  keyword: string;
  order?: "asc" | "desc";
  orderField?: string;
  limit?: number;
  offset?: number;
}

interface CountRow {
  count: number;
}

export async function searchByKeyword<T>({
  table,
  fields,
  keyword,
  order = "desc",
  orderField = "createdAt",
  limit = 10,
  offset = 0,
}: SearchByKeywordParams): Promise<{ list: T[]; totalCount: number }> {
  const token = keyword.trim().replace(/\s+/g, "");
  const wsPattern = "\\s+";
  const like = `%${token}%`;
  const orderDir = order === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
  const orderFieldRef = Prisma.raw(`"${orderField}"`);

  const conditions = fields.map(
    (field) =>
      Prisma.sql`regexp_replace(COALESCE(${Prisma.raw(`"${field}"`)}, ''), ${wsPattern}, '', 'g') ILIKE ${like}`,
  );

  const whereClause = conditions.reduce(
    (acc, condition) => Prisma.sql`${acc} OR ${condition}`,
  );

  const tableRef = Prisma.raw(`"${table}"`);

  const [list, totalCount] = await Promise.all([
    prisma.$queryRaw<T[]>`
      SELECT * FROM ${tableRef}
      WHERE (${whereClause})
      ORDER BY ${orderFieldRef} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int AS count FROM ${tableRef}
      WHERE (${whereClause})
    `,
  ]);

  return {
    list,
    totalCount: totalCount[0]?.count ?? 0,
  };
}
