function Delete(_path: string): MethodDecorator {
  return () => undefined;
}

function GlobalScope(_scope: string): MethodDecorator {
  return () => undefined;
}

export class QedixUsersController {
  @Delete(":id")
  @GlobalScope("user:delete")
  deleteUser(id: string) {
    return { deleted: id };
  }
}
