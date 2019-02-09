import getUserid from "../utils/getUserid";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }

    // (null, null) gets all scalar fields for the user.
    // id, name, email but NOT post or comments relations
    // prisma.query.users(null, null)

    // pass the info fields sent by the user.
    // all values that are after parameters set by {}
    // will be received by prisma
    return prisma.query.users(opArgs, info);
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserid(request);

    //Following not is in video.
    // if (!userId) {
    //  throw new Error("Not Authorized");
    //} up to here.

    return prisma.query.user({
      where: {
        id: userId
      }
    });
  }
};

export { Query as default };
