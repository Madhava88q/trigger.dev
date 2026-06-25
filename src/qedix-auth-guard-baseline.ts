function Delete(_path: string): MethodDecorator {
  return () => undefined;
}

function GlobalScope(_scope: string): MethodDecorator {
  return () => undefined;
}

export class QedixUsersController {
  @Delete(":id")
  deleteUser(id: string) {
    return { deleted: id };
  }
}
