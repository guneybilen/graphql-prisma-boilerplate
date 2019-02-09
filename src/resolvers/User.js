import getUserID from "../utils/getUserid";

const User = {
  // email object first or posts object first DOES NOT MATTER
  // fragment: 'fragment fragment_name on User { id }' (below for email object)
  // fragment_name can be any name. Just choose a random name
  // In the 'on User' part User is the type.
  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }, info) {
      const userId = getUserID(request, false);

      if (userId && userId == parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  }
};

export { User as default };
