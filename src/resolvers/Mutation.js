import bcrpt from "bcryptjs";
import getUserid from "../utils/getUserid";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    // He coded but later erase from here erased
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken");
    }
    // to here

    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: { email: args.data.email }
    });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcrpt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: generateToken(user.id)
    };
    // "thisisasecret" secret in login function and createUser function when using
    // jwt.sign function should be the same. He does not explain why.
  },

  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserid(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserid(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
  }
};

export { Mutation as default };
