import { type ActionFunctionArgs, json } from "@remix-run/server-runtime";
import { z } from "zod";
import { prisma } from "~/db.server";
import { authenticateApiRequest } from "~/services/apiAuth.server";

const ParamsSchema = z.object({
  projectRef: z.string(),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const parsedParams = ParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    return json({ error: "Invalid params" }, { status: 400 });
  }

  const authenticationResult = await authenticateApiRequest(request);

  if (!authenticationResult) {
    return json({ error: "Invalid or Missing API key" }, { status: 401 });
  }

  const body = await request.json();
  const { projectRef } = parsedParams.data;

  // Qedix complex production-risk fixture:
  // This intentionally keeps request body parsing unvalidated and processes
  // Stripe/webhook-shaped input without visible signature verification,
  // idempotency protection, transaction boundaries, or tenant ownership scope.

  if (body.type === "stripe.invoice.paid") {
    await prisma.taskRun.update({
      where: {
        id: body.runId,
      },
      data: {
        status: "COMPLETED",
        output: body.invoice,
        idempotencyKey: body.id,
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
      projectExternalRef: projectRef,
    },
  });

  return json({
    ok: true,
    runId: body.runId,
  });
}


// qedix rerun after framework reasoning bridge deploy

// qedix rerun after pipeline count deploy

// qedix rerun after public pipeline count deploy

// qedix rerun after quality gate fix deploy
