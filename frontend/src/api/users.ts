import { fetcher } from "@/lib/utils";
import { Validation, validations } from "@/lib/validations";
import { User } from "@/types";

export const users = {
  findOne: async (formData: Validation["tagret-user-by-id"]) => {
    const { id } = validations["tagret-user-by-id"].parse(formData);

    return fetcher<{ user: User | null }>(`/api/users/${id}`);
  },
};
