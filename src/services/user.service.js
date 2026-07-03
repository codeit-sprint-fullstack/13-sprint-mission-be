const { publicUser } = require("../utils/presenter.util");

function me(user) {
  return publicUser(user);
}

export { me };
