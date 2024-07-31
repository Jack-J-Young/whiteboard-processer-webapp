import { redirect } from "@sveltejs/kit";
import type {  } from "./$types";

export const actions: Actions = {
  modify: async ({ fetch, request, params }) => {
    const data = await request.formData();

    const res = await fetch(`api.example.com/update`), {
      method: "PUT",
      body: JSON.stringify({ myValue: data.get("myvalue") }),
    });

    if (!res.ok) {
      throw Error(await res.text());
    }

    throw redirect(303, `/update-complete`);
  },
};