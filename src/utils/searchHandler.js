import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";

export async function searchByKeyword({
  table,
  fields,
  keyword,
  order = "desc",
  limit = 10,
  offset = 0,
}) {
  const token = keyword.trim().replace(/\s+/g, "");
  const wsPattern = "\\s+";
  const like = `%${token}%`;
  const orderDir = order === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  const conditions = fields.map(
    (field) =>
      Prisma.sql`regexp_replace(COALESCE(${Prisma.raw(`"${field}"`)}, ''), ${wsPattern}, '', 'g') ILIKE ${like}`,
  );

  const whereClause = conditions.reduce(
    (acc, condition) => Prisma.sql`${acc} OR ${condition}`,
  );

  const tableRef = Prisma.raw(`"${table}"`);

  const [list, totalCount] = await Promise.all([
    prisma.$queryRaw`
      SELECT * FROM ${tableRef}
      WHERE (${whereClause})
      ORDER BY "createdAt" ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `,
    prisma.$queryRaw`
      SELECT COUNT(*)::int AS count FROM ${tableRef}
      WHERE (${whereClause})
    `,
  ]);

  return {
    list,
    totalCount: totalCount[0]?.count ?? 0,
  };
}
