export const users = {
  getOne: async ({ id }: { id: string }) => {
    const user = {
      id: "1",
      name: "Lamiaa Gebriel",
      email: "lamiaadev@gmail.com",
      image: "https://github.com/shadcn.png",
    };

    return { ok: true, data: { user } };
  },
};
