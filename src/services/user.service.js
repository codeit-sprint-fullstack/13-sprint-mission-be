import { publicUser } from "../utils/presenter.util.js";

function me(user) {
  return publicUser(user);
}

export { me };
