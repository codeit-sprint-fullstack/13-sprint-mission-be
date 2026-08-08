import { publicUser } from "../utils/presenter.util";
import type { AuthUser } from "../types/domain";

function me(user: AuthUser) {
  return publicUser(user);
}

export { me };
