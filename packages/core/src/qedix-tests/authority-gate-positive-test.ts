type DbClient = {
  connection: {
    findFirst(args: unknown): Promise<{ id: string; value: number } | null>;
    update(args: unknown): Promise<void>;
  };
};

export async function updateConnectionWithoutTenantScope(
  db: DbClient,
  connectionId: string,
  nextValue: number
) {
  const existing = await db.connection.findFirst({
    where: {
      id: connectionId,
    },
  });

  if (!existing) {
    return null;
  }

  await db.connection.update({
    where: {
      id: existing.id,
    },
    data: {
      value: existing.value + nextValue,
    },
  });

  return { success: true, data: { connectionId: existing.id } };
}
