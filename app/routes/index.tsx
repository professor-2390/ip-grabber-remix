import { Button, Container, TextInput, Divider } from "@mantine/core";
import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 10);

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const redirectUrl = form.get("redirectUrl");

  if (typeof redirectUrl !== "string") {
    throw new Error("Invalid redirectUrl");
  }

  const fields = { redirectUrl, trackId: nanoid() };

  const track = await db.track.create({
    data: fields,
  });

  return redirect(`/tracks/${track.trackId}`);
};

export default function Index() {
  return (
    <Container>
      <Form method="post" style={{ display: "flex", alignItems: "flex-end" }}>
        <TextInput
          size="xl"
          placeholder="https://youtube.com"
          label="Redirect URL"
          required
          name="redirectUrl"
          style={{ flex: 1 }}
          type="url"
        />

        <Button color="dark" radius="md" ml="md" size="xl" type="submit">
          Create tracker
        </Button>
      </Form>
        <Divider my="sm" variant="dashed" />
    </Container>
  );
}
