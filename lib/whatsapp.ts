type SendTemplateResult = { success: boolean; messageId?: string; error?: string };

export async function sendTemplate(
  to: string,
  templateName: string,
  bodyParams: string[],
): Promise<SendTemplateResult> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return { success: false, error: "Missing WhatsApp credentials" };
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: to.replace("+", ""),
      type: "template",
      template: {
        name: templateName,
        language: { code: "en_US" },
        components:
          bodyParams.length > 0
            ? [
                {
                  type: "body",
                  parameters: bodyParams.map((p) => ({ type: "text", text: p })),
                },
              ]
            : [],
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: unknown = await response.json();
    if (!response.ok) {
      const error = (data as { error?: { message?: string } }).error?.message ?? "Unknown error";
      return { success: false, error };
    }

    const messageId = (data as { messages?: Array<{ id?: string }> }).messages?.[0]?.id;
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
