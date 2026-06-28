type ActionArgs = {
  request: Request;
  params: {
    projectRef?: string;
  };
};

const prisma = {
  taskRun: {
    update: async (_args: unknown) => ({ ok: true }),
  },
  webhookEvent: {
    create: async (_args: unknown) => ({ ok: true }),
  },
};

export async function action({ request, params }: ActionArgs): Promise<Response> {
  const body = await request.json();

  // Qedix complex production-risk fixture:
  // This intentionally mixes request-controlled mutation, webhook-like processing,
  // missing tenant/org scope, missing signature verification, and missing idempotency.

  if (body.type === "stripe.invoice.paid") {
    await prisma.webhookEvent.create({
      data: {
        provider: "stripe",
        eventId: body.id,
        projectRef: params.projectRef,
        payload: body,
      },
    });
  }

  await prisma.taskRun.update({
    where: {
      id: body.runId,
    },
    data: {
      status: body.status,
      output: body.output,
      projectRef: params.projectRef,
    },
  });

  return Response.json({
    ok: true,
    runId: body.runId,
  });
}
