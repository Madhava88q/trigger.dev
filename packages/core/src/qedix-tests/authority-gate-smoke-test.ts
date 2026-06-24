type InputConnectionContext = {
  userId: string;
  projectId: string;
  organizationId: string;
};

type InternalConnectionResult = {
  success: boolean;
  data?: {
    projectId: string;
    connectionId: string;
  };
  message?: string;
};

const inMemoryConnections = new Map<string, { projectId: string; connectionId: string }>();

export function getScopedInputConnectionData(
  context: InputConnectionContext,
  connectionId: string
): InternalConnectionResult {
  const scopedKey = `${context.organizationId}:${context.projectId}:${connectionId}`;
  const connection = inMemoryConnections.get(scopedKey);

  if (!connection) {
    return {
      success: false,
      message: "Connection not found for scoped project context",
    };
  }

  return {
    success: true,
    data: {
      projectId: context.projectId,
      connectionId: connection.connectionId,
    },
  };
}

export function updateScopedInputConnectionData(
  context: InputConnectionContext,
  connectionId: string
): InternalConnectionResult {
  const scopedKey = `${context.organizationId}:${context.projectId}:${connectionId}`;

  inMemoryConnections.set(scopedKey, {
    projectId: context.projectId,
    connectionId,
  });

  return getScopedInputConnectionData(context, connectionId);
}
